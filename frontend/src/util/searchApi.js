import api from './api';

class SearchApi {
  // Tìm kiếm sản phẩm với filters
  async searchProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Thêm các tham số vào query string
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`/search/products?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  // Tìm kiếm nâng cao
  async advancedSearch(searchData) {
    try {
      const response = await api.post('/search/advanced', searchData);
      return response.data;
    } catch (error) {
      console.error('Advanced search error:', error);
      throw error;
    }
  }

  // Lấy suggestions cho autocomplete
  async getSuggestions(query, limit = 10) {
    try {
      if (!query || query.length < 2) {
        return { success: true, data: [] };
      }

      const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get suggestions error:', error);
      return { success: true, data: [] };
    }
  }

  // Đồng bộ tất cả sản phẩm (admin function)
  async syncAllProducts() {
    try {
      const response = await api.post('/search/sync-all');
      return response.data;
    } catch (error) {
      console.error('Sync all products error:', error);
      throw error;
    }
  }

  // Đồng bộ một sản phẩm cụ thể (admin function)
  async syncProduct(productId) {
    try {
      const response = await api.post(`/search/sync/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Sync product error:', error);
      throw error;
    }
  }

  // Xóa sản phẩm khỏi Elasticsearch (admin function)
  async removeProduct(productId) {
    try {
      const response = await api.delete(`/search/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Remove product error:', error);
      throw error;
    }
  }

  // Lấy thống kê tìm kiếm
  async getSearchStats() {
    try {
      const response = await api.get('/search/stats');
      return response.data;
    } catch (error) {
      console.error('Get search stats error:', error);
      throw error;
    }
  }
}

export default new SearchApi();
