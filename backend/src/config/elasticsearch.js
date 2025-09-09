const { Client } = require('elasticsearch');

// Cấu hình Elasticsearch client
const client = new Client({
  host: process.env.ELASTICSEARCH_URL || 'localhost:9200',
  log: 'error',
  apiVersion: '7.x'
});

// Kiểm tra kết nối Elasticsearch
const checkConnection = async () => {
  try {
    const response = await client.ping();
    console.log('✅ Elasticsearch connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Elasticsearch connection failed:', error.message);
    return false;
  }
};

// Tạo index cho products nếu chưa tồn tại
const createProductIndex = async () => {
  try {
    const indexExists = await client.indices.exists({
      index: 'products'
    });

    if (!indexExists) {
      await client.indices.create({
        index: 'products',
        body: {
          mappings: {
            properties: {
              name: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                  keyword: {
                    type: 'keyword'
                  },
                  suggest: {
                    type: 'completion'
                  }
                }
              },
              description: {
                type: 'text',
                analyzer: 'standard'
              },
              price: {
                type: 'float'
              },
              originalPrice: {
                type: 'float'
              },
              category: {
                type: 'keyword'
              },
              categoryName: {
                type: 'text',
                analyzer: 'standard'
              },
              stock: {
                type: 'integer'
              },
              isActive: {
                type: 'boolean'
              },
              tags: {
                type: 'keyword'
              },
              rating: {
                type: 'float'
              },
              reviewCount: {
                type: 'integer'
              },
              discount: {
                type: 'float'
              },
              viewCount: {
                type: 'integer',
                default: 0
              },
              createdAt: {
                type: 'date'
              },
              updatedAt: {
                type: 'date'
              }
            }
          },
          settings: {
            analysis: {
              analyzer: {
                vietnamese_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'asciifolding']
                }
              }
            }
          }
        }
      });
      console.log('✅ Products index created successfully');
    } else {
      console.log('✅ Products index already exists');
    }
  } catch (error) {
    console.error('❌ Error creating products index:', error.message);
  }
};

// Đồng bộ dữ liệu từ MongoDB sang Elasticsearch
const syncProductToElasticsearch = async (product) => {
  try {
    await client.index({
      index: 'products',
      id: product._id.toString(),
      body: {
        ...product,
        category: product.category._id.toString(),
        categoryName: product.category.name,
        discount: product.originalPrice ? 
          ((product.originalPrice - product.price) / product.originalPrice * 100) : 0,
        viewCount: product.viewCount || 0
      }
    });
  } catch (error) {
    console.error('Error syncing product to Elasticsearch:', error.message);
  }
};

// Xóa sản phẩm khỏi Elasticsearch
const deleteProductFromElasticsearch = async (productId) => {
  try {
    await client.delete({
      index: 'products',
      id: productId.toString()
    });
  } catch (error) {
    console.error('Error deleting product from Elasticsearch:', error.message);
  }
};

// Tìm kiếm sản phẩm với fuzzy search
const searchProducts = async (searchParams) => {
  try {
    const {
      query = '',
      category = null,
      minPrice = null,
      maxPrice = null,
      minRating = null,
      hasDiscount = null,
      minDiscount = null,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = searchParams;

    const from = (page - 1) * limit;
    
    // Xây dựng query
    const mustQueries = [];
    const filterQueries = [];

    // Query tìm kiếm chính
    if (query) {
      mustQueries.push({
        multi_match: {
          query: query,
          fields: ['name^3', 'description^2', 'categoryName', 'tags'],
          type: 'best_fields',
          fuzziness: 'AUTO',
          operator: 'or'
        }
      });
    }

    // Filter theo danh mục
    if (category) {
      filterQueries.push({
        term: { category: category }
      });
    }

    // Filter theo giá
    if (minPrice !== null || maxPrice !== null) {
      const priceRange = {};
      if (minPrice !== null) priceRange.gte = minPrice;
      if (maxPrice !== null) priceRange.lte = maxPrice;
      filterQueries.push({
        range: { price: priceRange }
      });
    }

    // Filter theo rating
    if (minRating !== null) {
      filterQueries.push({
        range: { rating: { gte: minRating } }
      });
    }

    // Filter theo khuyến mãi
    if (hasDiscount !== null) {
      if (hasDiscount) {
        filterQueries.push({
          range: { discount: { gt: 0 } }
        });
      } else {
        filterQueries.push({
          bool: {
            should: [
              { term: { discount: 0 } },
              { bool: { must_not: { exists: { field: 'discount' } } } }
            ]
          }
        });
      }
    }

    // Filter theo mức khuyến mãi tối thiểu
    if (minDiscount !== null) {
      filterQueries.push({
        range: { discount: { gte: minDiscount } }
      });
    }

    // Luôn filter sản phẩm active
    filterQueries.push({
      term: { isActive: true }
    });

    // Xây dựng body query
    const searchBody = {
      query: {
        bool: {
          must: mustQueries,
          filter: filterQueries
        }
      },
      from: from,
      size: limit
    };

    // Sắp xếp
    if (sortBy) {
      const sortField = sortBy === 'createdAt' ? 'createdAt' : 
                       sortBy === 'price' ? 'price' :
                       sortBy === 'name' ? 'name.keyword' :
                       sortBy === 'rating' ? 'rating' :
                       sortBy === 'reviewCount' ? 'reviewCount' :
                       sortBy === 'viewCount' ? 'viewCount' :
                       sortBy === 'discount' ? 'discount' : 'createdAt';
      
      searchBody.sort = [{
        [sortField]: {
          order: sortOrder
        }
      }];
    }

    // Thực hiện tìm kiếm
    const response = await client.search({
      index: 'products',
      body: searchBody
    });

    // Xử lý kết quả
    const products = response.hits.hits.map(hit => ({
      ...hit._source,
      _id: hit._id,
      _score: hit._score
    }));

    const total = response.hits.total.value;
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      aggregations: response.aggregations
    };
  } catch (error) {
    console.error('Error searching products:', error.message);
    throw error;
  }
};

// Lấy suggestions cho autocomplete
const getSuggestions = async (query, limit = 10) => {
  try {
    const response = await client.search({
      index: 'products',
      body: {
        suggest: {
          product_suggest: {
            prefix: query,
            completion: {
              field: 'name.suggest',
              size: limit
            }
          }
        }
      }
    });

    return response.suggest.product_suggest[0].options.map(option => ({
      text: option.text,
      score: option._score
    }));
  } catch (error) {
    console.error('Error getting suggestions:', error.message);
    return [];
  }
};

module.exports = {
  client,
  checkConnection,
  createProductIndex,
  syncProductToElasticsearch,
  deleteProductFromElasticsearch,
  searchProducts,
  getSuggestions
};
