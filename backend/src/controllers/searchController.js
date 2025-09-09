const searchService = require('../services/searchService');

class SearchController {
  // Tìm kiếm sản phẩm với filters
  async searchProducts(req, res) {
    try {
      const {
        q: query = '',
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
      } = req.query;

      const searchParams = {
        query,
        category,
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        minRating: minRating ? parseFloat(minRating) : null,
        hasDiscount: hasDiscount ? hasDiscount === 'true' : null,
        minDiscount: minDiscount ? parseFloat(minDiscount) : null,
        sortBy,
        sortOrder,
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await searchService.searchProductsWithFilters(searchParams);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tìm kiếm sản phẩm',
        error: error.message
      });
    }
  }

  // Tìm kiếm nâng cao
  async advancedSearch(req, res) {
    try {
      const {
        query = '',
        categories = [],
        priceRange = {},
        ratingRange = {},
        discountRange = {},
        inStock = null,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 12
      } = req.body;

      const searchParams = {
        query,
        categories: Array.isArray(categories) ? categories : [categories].filter(Boolean),
        priceRange: {
          min: priceRange.min ? parseFloat(priceRange.min) : null,
          max: priceRange.max ? parseFloat(priceRange.max) : null
        },
        ratingRange: {
          min: ratingRange.min ? parseFloat(ratingRange.min) : null,
          max: ratingRange.max ? parseFloat(ratingRange.max) : null
        },
        discountRange: {
          min: discountRange.min ? parseFloat(discountRange.min) : null,
          max: discountRange.max ? parseFloat(discountRange.max) : null
        },
        inStock: inStock ? inStock === 'true' : null,
        sortBy,
        sortOrder,
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const result = await searchService.advancedSearch(searchParams);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Advanced search error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tìm kiếm nâng cao',
        error: error.message
      });
    }
  }

  // Lấy suggestions cho autocomplete
  async getSuggestions(req, res) {
    try {
      const { q: query = '', limit = 10 } = req.query;

      if (!query || query.length < 2) {
        return res.json({
          success: true,
          data: []
        });
      }

      const suggestions = await searchService.getProductSuggestions(query, parseInt(limit));

      res.json({
        success: true,
        data: suggestions
      });
    } catch (error) {
      console.error('Get suggestions error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy gợi ý tìm kiếm',
        error: error.message
      });
    }
  }

  // Đồng bộ tất cả sản phẩm sang Elasticsearch
  async syncAllProducts(req, res) {
    try {
      const result = await searchService.syncAllProductsToElasticsearch();

      res.json({
        success: true,
        message: `Đồng bộ thành công ${result.syncedCount}/${result.total} sản phẩm`,
        data: result
      });
    } catch (error) {
      console.error('Sync all products error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đồng bộ sản phẩm',
        error: error.message
      });
    }
  }

  // Đồng bộ một sản phẩm cụ thể
  async syncProduct(req, res) {
    try {
      const { productId } = req.params;

      const result = await searchService.syncProductToElasticsearch(productId);

      res.json({
        success: true,
        message: 'Đồng bộ sản phẩm thành công',
        data: result
      });
    } catch (error) {
      console.error('Sync product error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đồng bộ sản phẩm',
        error: error.message
      });
    }
  }

  // Xóa sản phẩm khỏi Elasticsearch
  async removeProduct(req, res) {
    try {
      const { productId } = req.params;

      const result = await searchService.removeProductFromElasticsearch(productId);

      res.json({
        success: true,
        message: 'Xóa sản phẩm khỏi Elasticsearch thành công',
        data: result
      });
    } catch (error) {
      console.error('Remove product error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xóa sản phẩm',
        error: error.message
      });
    }
  }

  // Lấy thống kê tìm kiếm
  async getSearchStats(req, res) {
    try {
      const stats = await searchService.getSearchStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get search stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy thống kê tìm kiếm',
        error: error.message
      });
    }
  }
}

module.exports = new SearchController();
