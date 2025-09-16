import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, message, Spin, Breadcrumb, Button } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useParams, useSearchParams } from 'react-router-dom';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import SearchResults from '../components/SearchResults';
import productApi from '../util/productApi';
import searchApi from '../util/searchApi';
import { useContext } from 'react';
import { CartContext } from '../components/context/cart.context.jsx';
import { WishlistContext } from '../components/context/wishlist.context.jsx';

const { Content } = Layout;
const { Title } = Typography;

const Products = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [useSearchResults, setUseSearchResults] = useState(false);
  
  // State cho filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  
  // State cho advanced filters
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || null,
    minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null,
    minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : null,
    hasDiscount: searchParams.get('hasDiscount') === 'true' ? true : null,
    minDiscount: searchParams.get('minDiscount') ? parseFloat(searchParams.get('minDiscount')) : null,
    inStock: searchParams.get('inStock') === 'true' ? true : null
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const result = await productApi.getCategories();
        if (result.success) {
          setCategories(result.data);
          
          // Nếu có categoryId từ URL, set selected category
          if (categoryId) {
            const category = result.data.find(cat => cat._id === categoryId);
            setSelectedCategory(category);
          }
        }
      } catch (error) {
        message.error('Không thể tải danh mục sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [categoryId]);

  // Update URL params khi thay đổi filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (sortBy !== 'createdAt') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
    
    // Advanced filters
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.hasDiscount) params.set('hasDiscount', filters.hasDiscount);
    if (filters.minDiscount) params.set('minDiscount', filters.minDiscount);
    if (filters.inStock) params.set('inStock', filters.inStock);
    
    setSearchParams(params);
  }, [searchTerm, sortBy, sortOrder, filters, setSearchParams]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Reset search term khi chọn category mới
    setSearchTerm('');
    // Update category filter
    setFilters(prev => ({ ...prev, category: category?._id || null }));
  };

  // Xử lý tìm kiếm với Elasticsearch
  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      
      const searchParams = {
        q: searchTerm,
        category: filters.category || selectedCategory?._id,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating: filters.minRating,
        hasDiscount: filters.hasDiscount,
        minDiscount: filters.minDiscount,
        sortBy,
        sortOrder,
        page: 1,
        limit: 12
      };

      const result = await searchApi.searchProducts(searchParams);
      
      if (result.success) {
        setSearchResults(result.data);
        setUseSearchResults(true);
        message.success(`Tìm thấy ${result.data.pagination.total} sản phẩm`);
      }
    } catch (error) {
      message.error('Lỗi tìm kiếm sản phẩm');
      console.error('Search error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Tự động search khi có filters
    if (Object.values(newFilters).some(value => value !== null && value !== '')) {
      handleSearch();
    } else {
      setUseSearchResults(false);
      setSearchResults(null);
    }
  };

  const handleProductClick = (product) => {
    // TODO: Navigate to product detail page
    message.info(`Xem chi tiết sản phẩm: ${product.name}`);
  };

  const { addToCart } = useContext(CartContext);
  const { toggleWishlist } = useContext(WishlistContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    message.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleAddToWishlist = (product) => {
    toggleWishlist(product);
    message.success(`Đã cập nhật yêu thích: ${product.name}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          {/* Sidebar - Categories */}
          <Col xs={24} lg={6}>
            <CategoryList
              categories={categories}
              selectedCategoryId={selectedCategory?._id}
              onCategorySelect={handleCategorySelect}
            />
          </Col>

          {/* Main Content - Products */}
          <Col xs={24} lg={18}>
            {selectedCategory ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Breadcrumb>
                    <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
                    <Breadcrumb.Item>Danh mục</Breadcrumb.Item>
                    <Breadcrumb.Item>{selectedCategory.name}</Breadcrumb.Item>
                  </Breadcrumb>
                  <div style={{ margin: '8px 0' }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>Quay lại</Button>
                  </div>
                  <Title level={3} style={{ margin: 0 }}>
                    {selectedCategory.name}
                  </Title>
                  <Title level={5} type="secondary" style={{ margin: 0 }}>
                    {selectedCategory.description}
                  </Title>
                </div>

                <ProductFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={setSortBy}
                  onSortOrderChange={setSortOrder}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  categories={categories}
                  onSearch={handleSearch}
                  loading={searchLoading}
                />

                {useSearchResults ? (
                  <SearchResults
                    results={searchResults}
                    loading={searchLoading}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onProductClick={handleProductClick}
                  />
                ) : (
                  <ProductGrid
                    categoryId={selectedCategory._id}
                    searchTerm={searchTerm || null}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    filters={filters}
                    useElasticsearch={false}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Title level={4} type="secondary">
                  Vui lòng chọn một danh mục để xem sản phẩm
                </Title>
              </div>
            )}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Products;



