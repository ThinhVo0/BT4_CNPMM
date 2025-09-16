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
                analyzer: 'vietnamese_analyzer',
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
                analyzer: 'vietnamese_analyzer'
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
                analyzer: 'vietnamese_analyzer'
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
                null_value: 0
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
    // Tách _id ra khỏi product data
    const { _id, ...productData } = product;
    
    await client.index({
      index: 'products',
      id: _id.toString(),
      body: {
        ...productData,
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

// Lấy suggestions cho autocomplete (completion suggester)
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
              size: limit,
              skip_duplicates: true,
              fuzzy: { fuzziness: 'AUTO' }
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

// Fallback: gợi ý theo tiền tố name (có hỗ trợ filter theo category)
const getNamePrefixSuggestions = async (query, limit = 10, category = null) => {
  if (!query) return [];
  try {
    const filter = [{ term: { isActive: true } }];
    if (category) filter.push({ term: { category: category } });

    const response = await client.search({
      index: 'products',
      body: {
        size: limit,
        query: {
          bool: {
            must: [
              {
                match_phrase_prefix: {
                  name: {
                    query: query
                  }
                }
              }
            ],
            filter
          }
        }
      }
    });

    return response.hits.hits.map(hit => ({
      text: hit._source.name,
      score: hit._score
    }));
  } catch (error) {
    console.error('Error getNamePrefixSuggestions:', error.message);
    return [];
  }
};

// Wrapper: ưu tiên completion, nếu có category thì dùng prefix; nếu rỗng thì fallback sang prefix
const getSuggestionsSmart = async (query, limit = 10, category = null) => {
  if (category) {
    return await getNamePrefixSuggestions(query, limit, category);
  }
  const primary = await getSuggestions(query, limit);
  if (primary && primary.length > 0) return primary;
  return await getNamePrefixSuggestions(query, limit, null);
};

module.exports = {
  client,
  checkConnection,
  createProductIndex,
  syncProductToElasticsearch,
  deleteProductFromElasticsearch,
  searchProducts,
  getSuggestions,
  getNamePrefixSuggestions,
  getSuggestionsSmart
};

// Tìm kiếm nâng cao với function_score, highlight, và fuzziness toggle
const searchProductsAdvanced = async (params) => {
  try {
    const {
      query = '',
      limit = 10,
      fuzzy = true,
      category = null,
      page = 1,
      minPrice = null,
      maxPrice = null,
      minRating = null,
      hasDiscount = null,
      minDiscount = null,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const from = Math.max(0, (page - 1) * limit);

    // Build should queries so either fuzzy match or prefix can satisfy
    const shouldQueries = [];
    if (query) {
      shouldQueries.push({
        multi_match: {
          query: query,
          fields: ['name^5', 'description^2', 'categoryName^2'],
          type: 'best_fields',
          operator: 'or',
          fuzziness: fuzzy ? 'AUTO' : 0
        }
      });
    }

    if (query && query.length >= 2) {
      shouldQueries.push({
        match_phrase_prefix: {
          name: {
            query: query
          }
        }
      });
    }

    // Build filters
    const filterQueries = [
      { term: { isActive: true } },
      ...(category ? [{ term: { category: category } }] : [])
    ];

    if (minPrice !== null || maxPrice !== null) {
      const priceRange = {};
      if (minPrice !== null) priceRange.gte = minPrice;
      if (maxPrice !== null) priceRange.lte = maxPrice;
      filterQueries.push({ range: { price: priceRange } });
    }

    if (minRating !== null) {
      filterQueries.push({ range: { rating: { gte: minRating } } });
    }

    if (hasDiscount !== null) {
      if (hasDiscount) {
        filterQueries.push({ range: { discount: { gt: 0 } } });
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

    if (minDiscount !== null) {
      filterQueries.push({ range: { discount: { gte: minDiscount } } });
    }

    const functionScoreQuery = {
      function_score: {
        query: {
          bool: {
            // No must text query to avoid blocking short prefixes
            filter: filterQueries,
            should: shouldQueries,
            minimum_should_match: shouldQueries.length > 0 ? 1 : 0
          }
        },
        // Boost theo các chỉ số phổ biến: rating và viewCount (đóng vai trò sold_count)
        boost_mode: 'sum',
        score_mode: 'sum',
        functions: [
          {
            field_value_factor: {
              field: 'rating',
              factor: 1.0,
              modifier: 'sqrt',
              missing: 0
            }
          },
          {
            field_value_factor: {
              field: 'viewCount',
              factor: 0.1,
              modifier: 'log1p',
              missing: 0
            }
          },
          // Ưu tiên khớp chính xác theo name.keyword
          {
            weight: 3,
            filter: { term: { 'name.keyword': query } }
          }
        ]
      }
    };

    // Sorting mapping consistent with simple search
    const sortField = sortBy === 'createdAt' ? 'createdAt' : 
                      sortBy === 'price' ? 'price' :
                      sortBy === 'name' ? 'name.keyword' :
                      sortBy === 'rating' ? 'rating' :
                      sortBy === 'reviewCount' ? 'reviewCount' :
                      sortBy === 'viewCount' ? 'viewCount' :
                      sortBy === 'discount' ? 'discount' : 'createdAt';

    const response = await client.search({
      index: 'products',
      body: {
        track_total_hits: true,
        from,
        size: limit,
        query: functionScoreQuery,
        sort: [ { [sortField]: { order: sortOrder } } ],
        highlight: {
          pre_tags: ['<em>'],
          post_tags: ['</em>'],
          fields: {
            name: {},
            description: {},
            categoryName: {}
          }
        }
      }
    });

    const items = response.hits.hits.map(hit => ({
      id: hit._id,
      name: hit._source.name,
      price: hit._source.price,
      images: hit._source.images,
      description: hit._source.description,
      category: hit._source.category,
      categoryName: hit._source.categoryName,
      rating: hit._source.rating,
      reviewCount: hit._source.reviewCount,
      viewCount: hit._source.viewCount,
      originalPrice: hit._source.originalPrice,
      score: hit._score,
      highlight: hit.highlight || {}
    }));

    const total = response.hits.total?.value || items.length;
    return { items, total };
  } catch (error) {
    console.error('Error searchProductsAdvanced:', error.message);
    throw error;
  }
};

module.exports.searchProductsAdvanced = searchProductsAdvanced;
