import React from 'react';
import { Card, Row, Col, Typography, Tag, Space, Statistic } from 'antd';
import { EyeOutlined, StarOutlined, ShoppingCartOutlined, HeartFilled } from '@ant-design/icons';
import { useContext } from 'react';
import { WishlistContext } from './context/wishlist.context.jsx';

const { Title, Text } = Typography;

const SearchResults = ({ 
  results, 
  loading = false, 
  onAddToCart, 
  onAddToWishlist,
  onProductClick 
}) => {
  const { products = [], pagination = {} } = results;
  const { items: wishlistItems } = useContext(WishlistContext);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div>Đang tìm kiếm...</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={4} type="secondary">
          Không tìm thấy sản phẩm nào
        </Title>
        <Text type="secondary">
          Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
        </Text>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div>
      {/* Thống kê kết quả */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic 
              title="Tổng số sản phẩm" 
              value={pagination.total || 0} 
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Trang hiện tại" 
              value={pagination.currentPage || 1} 
              suffix={`/ ${pagination.totalPages || 1}`}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Sản phẩm/trang" 
              value={pagination.limit || 12} 
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="Có trang tiếp" 
              value={pagination.hasNext ? 'Có' : 'Không'} 
              valueStyle={{ color: pagination.hasNext ? '#3f8600' : '#cf1322' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Danh sách sản phẩm */}
      <Row gutter={[16, 16]}>
        {products.map((product) => {
          const discount = calculateDiscount(product.originalPrice, product.price);
          
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Card
                hoverable
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={product.name}
                      src={product.images?.[0] || 'https://via.placeholder.com/300x200'}
                      style={{ 
                        height: 200, 
                        objectFit: 'cover',
                        width: '100%'
                      }}
                    />
                    {discount > 0 && (
                      <Tag 
                        color="red" 
                        style={{ 
                          position: 'absolute', 
                          top: 8, 
                          left: 8 
                        }}
                      >
                        -{discount}%
                      </Tag>
                    )}
                    {product.isFeatured && (
                      <Tag 
                        color="gold" 
                        style={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8 
                        }}
                      >
                        Nổi bật
                      </Tag>
                    )}
                  </div>
                }
                actions={[
                  <ShoppingCartOutlined 
                    key="cart" 
                    onClick={() => onAddToCart && onAddToCart(product)}
                  />,
                  <StarOutlined 
                    key="wishlist" 
                    onClick={(e) => { e.stopPropagation(); onAddToWishlist && onAddToWishlist(product); }}
                  />,
                  <EyeOutlined 
                    key="view" 
                    onClick={() => onProductClick && onProductClick(product)}
                  />
                ]}
                onClick={() => onProductClick && onProductClick(product)}
              >
                <Card.Meta
                  title={
                    <Title level={5} ellipsis={{ rows: 2 }}>
                      {product.name}
                    </Title>
                  }
                  description={
                    <div>
                      <Text ellipsis={{ rows: 2 }} style={{ display: 'block', marginBottom: 8 }}>
                        {product.description}
                      </Text>
                      
                      {/* Giá */}
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ fontSize: '16px', color: '#f5222d' }}>
                          {formatPrice(product.price)}
                        </Text>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <Text 
                            delete 
                            type="secondary" 
                            style={{ marginLeft: 8 }}
                          >
                            {formatPrice(product.originalPrice)}
                          </Text>
                        )}
                      </div>

                      {/* Thông tin sản phẩm */}
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {product.category && (
                          <Tag color="blue">{product.category.name}</Tag>
                        )}
                        
                        <Space>
                          <StarOutlined style={{ color: '#faad14' }} />
                          <Text>{product.rating || 0}</Text>
                          <Text type="secondary">({product.reviewCount || 0})</Text>
                        </Space>
                        
                        <Space>
                          <EyeOutlined />
                          <Text type="secondary">{product.viewCount || 0} lượt xem</Text>
                        </Space>
                        
                        {product.stock > 0 ? (
                          <Tag color="green">Còn hàng ({product.stock})</Tag>
                        ) : (
                          <Tag color="red">Hết hàng</Tag>
                        )}
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Phân trang info */}
      {pagination.total > 0 && (
        <div style={{ textAlign: 'center', marginTop: 24, padding: 16 }}>
          <Text type="secondary">
            Hiển thị {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.total)} 
            trong tổng số {pagination.total} sản phẩm
          </Text>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
