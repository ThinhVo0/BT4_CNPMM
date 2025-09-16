# Shop Online - Chức năng hiển thị sản phẩm theo danh mục

## Tính năng đã implement

### Backend
- **Models**: Product và Category với MongoDB
- **API Endpoints**:
  - `GET /api/categories` - Lấy tất cả danh mục
  - `GET /api/categories/:categoryId/products` - Lấy sản phẩm theo danh mục với phân trang
  - `GET /api/products/:productId` - Lấy sản phẩm theo ID
  - `GET /api/products/search` - Tìm kiếm sản phẩm
- **Features**:
  - Phân trang sản phẩm
  - Sắp xếp theo nhiều tiêu chí (giá, tên, đánh giá, ngày tạo)
  - Tìm kiếm full-text search
  - Lazy loading với infinite scroll

### Frontend
- **Components**:
  - `ProductCard`: Hiển thị thông tin sản phẩm với giá, đánh giá, tags
  - `ProductGrid`: Grid sản phẩm với infinite scroll
  - `CategoryList`: Danh sách danh mục
  - `ProductFilters`: Bộ lọc và sắp xếp sản phẩm
- **Pages**:
  - `Products`: Trang chính hiển thị sản phẩm theo danh mục
- **Features**:
  - Infinite scroll (Lazy Loading)
  - Responsive design
  - URL state management
  - Search và filter real-time

## Cài đặt và chạy

### Prerequisites
- Node.js (v16+)
- MongoDB (local hoặc cloud)
- npm hoặc yarn

### Backend Setup
```bash
cd backend
npm install

# Tạo file .env (hoặc set environment variables)
echo "MONGODB_URI=mongodb://localhost:27017/shop_db" > .env
echo "PORT=3000" >> .env
echo "JWT_SECRET=your_secret_key_here" >> .env

# Chạy seed data
npm run seed

# Chạy server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Test API
```bash
cd backend
npm run test-api
```

## Cấu trúc dữ liệu

### Category
```javascript
{
  name: String,
  description: String,
  image: String,
  isActive: Boolean
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  category: ObjectId (ref: Category),
  stock: Number,
  tags: [String],
  rating: Number,
  reviewCount: Number
}
```

## API Usage

### Lấy sản phẩm theo danh mục
```
GET /api/categories/:categoryId/products?page=1&limit=12&sortBy=price&sortOrder=desc
```

**Query Parameters:**
- `page`: Số trang (default: 1)
- `limit`: Số sản phẩm mỗi trang (default: 12)
- `sortBy`: Tiêu chí sắp xếp (createdAt, price, name, rating, reviewCount)
- `sortOrder`: Thứ tự sắp xếp (asc, desc)

### Tìm kiếm sản phẩm
```
GET /api/products/search?q=iphone&categoryId=123&page=1&limit=12
```

**Query Parameters:**
- `q`: Từ khóa tìm kiếm (required)
- `categoryId`: ID danh mục (optional)
- `page`: Số trang (default: 1)
- `limit`: Số kết quả mỗi trang (default: 12)

## Tính năng Infinite Scroll

- Sử dụng Intersection Observer API
- Tự động load thêm sản phẩm khi scroll đến cuối
- Reset pagination khi thay đổi filter
- Loading state và error handling
- Optimized với useCallback và useRef

## Responsive Design

- Mobile-first approach
- Grid system với Ant Design
- Breakpoints: xs(24), sm(12), md(8), lg(6), xl(6)
- Responsive sidebar cho mobile

## Troubleshooting

### Backend Issues
1. **MongoDB Connection Error**:
   - Kiểm tra MongoDB service đang chạy
   - Kiểm tra MONGODB_URI trong .env
   - Đảm bảo port 27017 không bị block

2. **Port Already in Use**:
   - Thay đổi PORT trong .env
   - Hoặc kill process đang sử dụng port 3000

3. **Module Not Found**:
   - Chạy `npm install` để cài dependencies
   - Kiểm tra import/require paths

### Frontend Issues
1. **API Connection Error**:
   - Kiểm tra backend server đang chạy
   - Kiểm tra CORS configuration
   - Kiểm tra API_BASE_URL trong productApi.js

2. **Build Errors**:
   - Xóa node_modules và package-lock.json
   - Chạy `npm install` lại
   - Kiểm tra React version compatibility

## Development Workflow

1. **Backend Development**:
   ```bash
   npm run dev          # Chạy server với nodemon
   npm run seed         # Reset và seed data
   npm run test-api     # Test API endpoints
   ```

2. **Frontend Development**:
   ```bash
   npm run dev          # Chạy dev server
   npm run build        # Build production
   npm run lint         # Kiểm tra code style
   ```

## TODO

- [ ] Implement giỏ hàng
- [ ] Implement wishlist
- [ ] Product detail page
- [ ] Admin panel để quản lý sản phẩm
- [ ] Image upload
- [ ] Payment integration
- [ ] User reviews và ratings
- [ ] Order management
- [ ] Email notifications
- [ ] Analytics dashboard

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

ISC License
