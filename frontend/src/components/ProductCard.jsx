import React from 'react';
import { Card, Tag, Rate, Space, Typography } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
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

  const discount = calculateDiscount(product.originalPrice, product.price);

  return (
    <Card
      hoverable
      cover={
        <div style={{ position: 'relative' }}>
          <img
            alt={product.name}
            src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
            style={{ 
              height: 200, 
              objectFit: 'cover',
              width: '100%'
            }}
          />
          {discount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: '#ff4d4f',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              -{discount}%
            </div>
          )}
        </div>
      }
      actions={[
        <ShoppingCartOutlined 
          key="cart" 
          onClick={() => onAddToCart?.(product)}
          style={{ fontSize: '18px' }}
        />,
        <HeartOutlined 
          key="wishlist" 
          onClick={() => onAddToWishlist?.(product)}
          style={{ fontSize: '18px' }}
        />
      ]}
      style={{ height: '100%' }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Title level={5} style={{ marginBottom: 8, lineHeight: 1.4 }}>
          {product.name}
        </Title>
        
        <div style={{ flex: 1 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {product.description}
          </Text>
        </div>

        <div style={{ marginTop: 12 }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: '16px', color: '#ff4d4f' }}>
                {formatPrice(product.price)}
              </Text>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text delete style={{ marginLeft: 8, fontSize: '14px' }}>
                  {formatPrice(product.originalPrice)}
                </Text>
              )}
            </div>

            <div>
              <Rate 
                disabled 
                defaultValue={product.rating} 
                style={{ fontSize: '12px' }}
              />
              <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                ({product.reviewCount})
              </Text>
            </div>

            <div>
              {product.tags?.map((tag, index) => (
                <Tag key={index} size="small" style={{ marginBottom: 4 }}>
                  {tag}
                </Tag>
              ))}
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Còn lại: {product.stock} sản phẩm
              </Text>
            </div>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;





