const Product = require('../models/product');
const Category = require('../models/category');
const { 
  searchProducts, 
  searchProductsAdvanced,
  syncProductToElasticsearch, 
  deleteProductFromElasticsearch,
  getSuggestions,
  getSuggestionsSmart
} = require('../config/elasticsearch');

class SearchService {
  // Tìm kiếm sản phẩm với Elasticsearch
  async searchProductsWithFilters(searchParams) {
    try {
      const result = await searchProducts(searchParams);
      
      // Populate category information cho các sản phẩm
      const productIds = result.products.map(p => p._id);
      const productsWithCategory = await Product.find({ _id: { $in: productIds } })
        .populate('category', 'name description')
        .lean();

      // Merge thông tin category vào kết quả
      const enrichedProducts = result.products.map(product => {
        const dbProduct = productsWithCategory.find(p => p._id.toString() === product._id);
        return {
          ...product,
          category: dbProduct ? dbProduct.category : null
        };
      });

      return {
        ...result,
        products: enrichedProducts
      };
    } catch (error) {
      console.error('Search service error:', error);
      throw error;
    }
  }

  // Tìm kiếm nâng cao theo yêu cầu API mới
  async searchProductsV2({ 
    query = '', 
    limit = 10, 
    fuzzy = true, 
    autocomplete = false, 
    category = null, 
    page = 1,
    minPrice = null,
    maxPrice = null,
    minRating = null,
    hasDiscount = null,
    minDiscount = null,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) {
    try {
      if (autocomplete) {
        // Sử dụng smart suggester: completion ưu tiên, fallback prefix, hỗ trợ category
        const suggestions = await getSuggestionsSmart(query, limit, category);
        return suggestions.map(s => ({ id: undefined, name: s.text, price: undefined, score: s.score, highlight: {} }));
      }

      const { items, total } = await searchProductsAdvanced({ 
        query, 
        limit, 
        fuzzy, 
        category, 
        page,
        minPrice,
        maxPrice,
        minRating,
        hasDiscount,
        minDiscount,
        sortBy,
        sortOrder
      });
      // Chuẩn hóa response cho frontend SearchResults.jsx
      const products = items.map(p => ({
        _id: p.id,
        name: p.name,
        price: p.price,
        images: p.images,
        description: p.description,
        category: { name: p.categoryName },
        rating: p.rating,
        reviewCount: p.reviewCount,
        viewCount: p.viewCount,
        originalPrice: p.originalPrice,
        _score: p.score,
        highlight: p.highlight
      }));
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
        }
      };
    } catch (error) {
      console.error('Search V2 service error:', error);
      throw error;
    }
  }

  // Lấy suggestions cho autocomplete
  async getProductSuggestions(query, limit = 10) {
    try {
      // Dùng smart để tự fallback khi completion chưa sẵn sàng
      return await getSuggestionsSmart(query, limit, null);
    } catch (error) {
      console.error('Suggestions service error:', error);
      return [];
    }
  }

  // Đồng bộ tất cả sản phẩm từ MongoDB sang Elasticsearch
  async syncAllProductsToElasticsearch() {
    try {
      console.log('🔄 Starting sync all products to Elasticsearch...');
      
      const products = await Product.find({ isActive: true })
        .populate('category', 'name')
        .lean();

      let syncedCount = 0;
      for (const product of products) {
        await syncProductToElasticsearch(product);
        syncedCount++;
      }

      console.log(`✅ Synced ${syncedCount} products to Elasticsearch`);
      return { syncedCount, total: products.length };
    } catch (error) {
      console.error('Error syncing products:', error);
      throw error;
    }
  }

  // Đồng bộ một sản phẩm cụ thể
  async syncProductToElasticsearch(productId) {
    try {
      const product = await Product.findById(productId)
        .populate('category', 'name')
        .lean();

      if (!product) {
        throw new Error('Product not found');
      }

      await syncProductToElasticsearch(product);
      return { success: true };
    } catch (error) {
      console.error('Error syncing product:', error);
      throw error;
    }
  }

  // Xóa sản phẩm khỏi Elasticsearch
  async removeProductFromElasticsearch(productId) {
    try {
      await deleteProductFromElasticsearch(productId);
      return { success: true };
    } catch (error) {
      console.error('Error removing product from Elasticsearch:', error);
      throw error;
    }
  }

  // Lấy thống kê tìm kiếm
  async getSearchStats() {
    try {
      // Có thể thêm các thống kê như:
      // - Số lượng sản phẩm được tìm kiếm nhiều nhất
      // - Từ khóa tìm kiếm phổ biến
      // - Thời gian tìm kiếm trung bình
      return {
        message: 'Search stats feature coming soon'
      };
    } catch (error) {
      console.error('Error getting search stats:', error);
      throw error;
    }
  }

  // Tìm kiếm nâng cao với nhiều điều kiện
  async advancedSearch(searchParams) {
    try {
      const {
        query = '',
        categories = [],
        priceRange = { min: null, max: null },
        ratingRange = { min: null, max: null },
        discountRange = { min: null, max: null },
        inStock = null,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 12
      } = searchParams;

      // Chuyển đổi parameters để phù hợp với Elasticsearch
      const elasticsearchParams = {
        query,
        category: categories.length === 1 ? categories[0] : null,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        minRating: ratingRange.min,
        minDiscount: discountRange.min,
        sortBy,
        sortOrder,
        page,
        limit
      };

      // Nếu có nhiều categories, cần xử lý riêng
      if (categories.length > 1) {
        // Tìm kiếm riêng cho từng category rồi merge kết quả
        const results = await Promise.all(
          categories.map(categoryId => 
            searchProducts({ ...elasticsearchParams, category: categoryId })
          )
        );

        // Merge và deduplicate kết quả
        const allProducts = [];
        const seenIds = new Set();
        
        results.forEach(result => {
          result.products.forEach(product => {
            if (!seenIds.has(product._id)) {
              seenIds.add(product._id);
              allProducts.push(product);
            }
          });
        });

        // Sắp xếp lại theo yêu cầu
        allProducts.sort((a, b) => {
          const aValue = a[sortBy] || 0;
          const bValue = b[sortBy] || 0;
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        });

        // Phân trang
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = allProducts.slice(startIndex, endIndex);

        return {
          products: paginatedProducts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(allProducts.length / limit),
            total: allProducts.length,
            limit,
            hasNext: endIndex < allProducts.length,
            hasPrev: page > 1
          }
        };
      }

      return await this.searchProductsWithFilters(elasticsearchParams);
    } catch (error) {
      console.error('Advanced search error:', error);
      throw error;
    }
  }
}

module.exports = new SearchService();
