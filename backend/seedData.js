const mongoose = require('mongoose');
const Category = require('./src/models/category');
const Product = require('./src/models/product');
const { checkConnection, createProductIndex, syncProductToElasticsearch } = require('./src/config/elasticsearch');
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

// Hàm tạo 10 sản phẩm mẫu theo danh mục
function generateProductsForCategory(categoryName) {
  const phoneModels = [
    { brand: 'Apple', model: 'iPhone 15 Pro' },
    { brand: 'Apple', model: 'iPhone 15' },
    { brand: 'Samsung', model: 'Galaxy S24 Ultra' },
    { brand: 'Samsung', model: 'Galaxy A55' },
    { brand: 'Xiaomi', model: 'Redmi Note 13 Pro' },
    { brand: 'OPPO', model: 'Reno10' },
    { brand: 'Vivo', model: 'V30' },
    { brand: 'Realme', model: '11 Pro' },
    { brand: 'Google', model: 'Pixel 8' },
    { brand: 'Nokia', model: 'G50' }
  ];
  const laptopModels = [
    { brand: 'Apple', model: 'MacBook Air M2' },
    { brand: 'Apple', model: 'MacBook Pro M3' },
    { brand: 'Dell', model: 'XPS 13' },
    { brand: 'Dell', model: 'Inspiron 15' },
    { brand: 'HP', model: 'Spectre x360' },
    { brand: 'HP', model: 'Pavilion 14' },
    { brand: 'Lenovo', model: 'ThinkPad X1 Carbon' },
    { brand: 'ASUS', model: 'ROG Zephyrus G14' },
    { brand: 'Acer', model: 'Swift 3' },
    { brand: 'MSI', model: 'Modern 14' }
  ];
  const tabletModels = [
    { brand: 'Apple', model: 'iPad Pro 12.9' },
    { brand: 'Apple', model: 'iPad Air' },
    { brand: 'Samsung', model: 'Galaxy Tab S9' },
    { brand: 'Samsung', model: 'Galaxy Tab A9' },
    { brand: 'Xiaomi', model: 'Pad 6' },
    { brand: 'Lenovo', model: 'Tab P11' },
    { brand: 'Huawei', model: 'MatePad 11' },
    { brand: 'Amazon', model: 'Fire HD 10' },
    { brand: 'Realme', model: 'Pad 2' },
    { brand: 'OPPO', model: 'Pad Air' }
  ];
  const accessoryModels = [
    { brand: 'Apple', model: 'AirPods Pro' },
    { brand: 'Sony', model: 'WH-1000XM5' },
    { brand: 'JBL', model: 'Charge 5' },
    { brand: 'Anker', model: 'PowerCore 20000' },
    { brand: 'Logitech', model: 'MX Master 3S' },
    { brand: 'Razer', model: 'BlackWidow V3' },
    { brand: 'Samsung', model: 'Galaxy Buds2 Pro' },
    { brand: 'Xiaomi', model: 'Mi Band 8' },
    { brand: 'Baseus', model: 'GaN Charger 65W' },
    { brand: 'Ugreen', model: 'USB-C Hub 7-in-1' }
  ];

  const byCategory = {
    'Điện thoại': phoneModels,
    'dien thoai': phoneModels,
    'phone': phoneModels,
    'Laptop': laptopModels,
    'Máy tính bảng': tabletModels,
    'may tinh bang': tabletModels,
    'Tablet': tabletModels,
    'Phụ kiện': accessoryModels,
    'phu kien': accessoryModels,
    'Accessories': accessoryModels
  };

  const key = (categoryName || '').toLowerCase();
  const models = byCategory[categoryName] || byCategory[key] || accessoryModels;

  const items = [];
  for (let i = 0; i < 10; i++) {
    const pick = models[i % models.length];
    const variant = i % 3 === 0 ? '128GB' : i % 3 === 1 ? '256GB' : '512GB';
    const name = `${pick.brand} ${pick.model}${key.includes('điện thoại') || key.includes('phone') ? ' ' + variant : ''}`;
    const basePrice = 1000000 + Math.floor(Math.random() * 30000000);
    const original = Math.random() > 0.5 ? basePrice + Math.floor(Math.random() * 3000000) : null;
    items.push({
      name,
      description: `${pick.brand} ${pick.model} chính hãng, hiệu năng ổn định, bảo hành 12 tháng`,
      price: basePrice,
      originalPrice: original,
      images: [`https://via.placeholder.com/400x400?text=${encodeURIComponent(pick.brand + ' ' + pick.model)}`],
      stock: 10 + Math.floor(Math.random() * 100),
      tags: [categoryName.toLowerCase(), pick.brand.toLowerCase()],
      rating: Math.round((3 + Math.random() * 2) * 10) / 10,
      reviewCount: Math.floor(Math.random() * 500),
      viewCount: Math.floor(Math.random() * 5000)
    });
  }
  return items;
}

async function seedData() {
  try {
    // Xóa dữ liệu cũ
    await Category.deleteMany({});
    await Product.deleteMany({});
    
    console.log('Đã xóa dữ liệu cũ');

    // Tạo categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Đã tạo categories:', createdCategories.length);

    // Tạo 10 sản phẩm mỗi danh mục
    let totalProducts = 0;
    for (const cat of createdCategories) {
      const items = generateProductsForCategory(cat.name).map(p => ({ ...p, category: cat._id }));
      const created = await Product.insertMany(items);
      totalProducts += created.length;
    }
    console.log('Đã tạo products:', totalProducts);

    // Đồng bộ sang Elasticsearch nếu khả dụng
    const esOk = await checkConnection();
    if (esOk) {
      await createProductIndex();
      const allProducts = await Product.find({}).populate('category', 'name').lean();
      for (const p of allProducts) {
        await syncProductToElasticsearch(p);
      }
      console.log('Đã đồng bộ Elasticsearch');
    } else {
      console.warn('Elasticsearch không sẵn sàng, bỏ qua đồng bộ');
    }

    console.log('Seed dữ liệu thành công!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
}

seedData();



