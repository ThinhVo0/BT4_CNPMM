const mongoose = require('mongoose');
const Category = require('./src/models/category');
const Product = require('./src/models/product');
require('dotenv').config();

// Kết nối database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shop_db');

const categories = [
  {
    name: 'Điện thoại',
    description: 'Các loại điện thoại di động',
    image: 'https://via.placeholder.com/300x200?text=Phone'
  },
  {
    name: 'Laptop',
    description: 'Máy tính xách tay các loại',
    image: 'https://via.placeholder.com/300x200?text=Laptop'
  },
  {
    name: 'Máy tính bảng',
    description: 'iPad và các loại máy tính bảng khác',
    image: 'https://via.placeholder.com/300x200?text=Tablet'
  },
  {
    name: 'Phụ kiện',
    description: 'Phụ kiện điện tử các loại',
    image: 'https://via.placeholder.com/300x200?text=Accessories'
  }
];

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Điện thoại iPhone mới nhất với chip A17 Pro',
    price: 29990000,
    originalPrice: 32990000,
    images: ['https://via.placeholder.com/400x400?text=iPhone15Pro'],
    stock: 50,
    tags: ['iPhone', 'Apple', '5G'],
    rating: 4.8,
    reviewCount: 125
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Flagship Android với camera AI tiên tiến',
    price: 24990000,
    originalPrice: 27990000,
    images: ['https://via.placeholder.com/400x400?text=GalaxyS24'],
    stock: 45,
    tags: ['Samsung', 'Android', '5G'],
    rating: 4.7,
    reviewCount: 98
  },
  {
    name: 'MacBook Pro M3',
    description: 'Laptop mạnh mẽ với chip M3',
    price: 45990000,
    originalPrice: 49990000,
    images: ['https://via.placeholder.com/400x400?text=MacBookPro'],
    stock: 30,
    tags: ['MacBook', 'Apple', 'M3'],
    rating: 4.9,
    reviewCount: 67
  },
  {
    name: 'Dell XPS 13',
    description: 'Laptop cao cấp với thiết kế InfinityEdge',
    price: 32990000,
    originalPrice: 35990000,
    images: ['https://via.placeholder.com/400x400?text=DellXPS13'],
    stock: 25,
    tags: ['Dell', 'Windows', 'Premium'],
    rating: 4.6,
    reviewCount: 89
  },
  {
    name: 'iPad Pro 12.9',
    description: 'Máy tính bảng mạnh mẽ với chip M2',
    price: 28990000,
    originalPrice: 31990000,
    images: ['https://via.placeholder.com/400x400?text=iPadPro'],
    stock: 40,
    tags: ['iPad', 'Apple', 'M2'],
    rating: 4.8,
    reviewCount: 156
  },
  {
    name: 'AirPods Pro',
    description: 'Tai nghe không dây với chống ồn chủ động',
    price: 5990000,
    originalPrice: 6990000,
    images: ['https://via.placeholder.com/400x400?text=AirPodsPro'],
    stock: 100,
    tags: ['AirPods', 'Apple', 'Wireless'],
    rating: 4.7,
    reviewCount: 234
  }
];

async function seedData() {
  try {
    // Xóa dữ liệu cũ
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Đã xóa dữ liệu cũ');

    // Tạo categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Đã tạo categories:', createdCategories.length);

    // Tạo products với category tương ứng
    const productsWithCategories = products.map((product, index) => {
      const categoryIndex = Math.floor(index / 2); // Phân bố đều cho các category
      return {
        ...product,
        category: createdCategories[categoryIndex]._id
      };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('Đã tạo products:', createdProducts.length);

    console.log('Seed dữ liệu thành công!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
}

seedData();
