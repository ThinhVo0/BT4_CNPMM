import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; 

const productApi = {
  // Lấy tất cả danh mục
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục với phân trang
  getProductsByCategory: async (categoryId, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/products`, {
        params: {
          page,
          limit,
          sortBy,
          sortOrder
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (searchTerm, categoryId = null, page = 1, limit = 12) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/search`, {
        params: {
          q: searchTerm,
          categoryId,
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productApi;
