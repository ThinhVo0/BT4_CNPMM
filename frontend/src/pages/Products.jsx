import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, message, Spin } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import productApi from '../util/productApi';

const { Content } = Layout;
const { Title } = Typography;

const Products = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State cho filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

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
    
    setSearchParams(params);
  }, [searchTerm, sortBy, sortOrder, setSearchParams]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Reset search term khi chọn category mới
    setSearchTerm('');
  };

  const handleAddToCart = (product) => {
    message.success(`Đã thêm ${product.name} vào giỏ hàng`);
    // TODO: Implement cart functionality
  };

  const handleAddToWishlist = (product) => {
    message.success(`Đã thêm ${product.name} vào yêu thích`);
    // TODO: Implement wishlist functionality
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
                />

                <ProductGrid
                  categoryId={selectedCategory._id}
                  searchTerm={searchTerm || null}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
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
