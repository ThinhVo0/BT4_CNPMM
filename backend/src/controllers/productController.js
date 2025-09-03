const productService = require('../services/productService');

class ProductController {
  // Lấy sản phẩm theo danh mục với phân trang
  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      const result = await productService.getProductsByCategory(
        categoryId,
        parseInt(page),
        parseInt(limit),
        sortBy,
        sortOrder
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy tất cả danh mục
  async getAllCategories(req, res) {
    try {
      const categories = await productService.getAllCategories();
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(req, res) {
    try {
      const { productId } = req.params;
      const product = await productService.getProductById(productId);
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Tìm kiếm sản phẩm
  async searchProducts(req, res) {
    try {
      const { q, categoryId, page = 1, limit = 12 } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const result = await productService.searchProducts(
        q,
        categoryId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ProductController();
