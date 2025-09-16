const Product = require('../models/product');
const Category = require('../models/category');

class ProductService {
  // Lấy danh sách sản phẩm theo danh mục với phân trang
  async getProductsByCategory(categoryId, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc') {
    try {
      const skip = (page - 1) * limit;
      
      // Kiểm tra danh mục có tồn tại không
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      // Query sản phẩm theo danh mục
      const query = {
        category: categoryId,
        isActive: true
      };

      // Sắp xếp
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Lấy sản phẩm với populate category
      const products = await Product.find(query)
        .populate('category', 'name')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();

      // Đếm tổng số sản phẩm
      const total = await Product.countDocuments(query);
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
      throw error;
    }
  }

  // Lấy tất cả danh mục
  async getAllCategories() {
    try {
      const categories = await Category.find({ isActive: true })
        .select('name description image')
        .lean();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(productId) {
    try {
      const product = await Product.findById(productId)
        .populate('category', 'name description')
        .lean();
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  // Tìm kiếm sản phẩm
  async searchProducts(searchTerm, categoryId = null, page = 1, limit = 12) {
    try {
      const skip = (page - 1) * limit;
      
      let query = {
        isActive: true,
        $or: [
          { name: { $regex: searchTerm } },
          { description: { $regex: searchTerm } },
          { tags: { $in: [new RegExp(searchTerm)] } }
        ]
      };

      if (categoryId) {
        query.category = categoryId;
      }

      const products = await Product.find(query)
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Product.countDocuments(query);
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
      throw error;
    }
  }
}

module.exports = new ProductService();
