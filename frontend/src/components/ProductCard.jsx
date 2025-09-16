import React from 'react';
import { Card, Tag, Rate, Space, Typography, Button } from 'antd';
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { WishlistContext } from './context/wishlist.context.jsx';

const { Text, Title } = Typography;

import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  const { items: wishlistItems } = useContext(WishlistContext);
  const wished = wishlistItems.some(w => w._id === product._id);
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
    <Card hoverable style={{ height: '100%', overflow: 'hidden' }} onClick={() => navigate(`/products/${product._id}`)}>
      <div style={{ position: 'relative' }}>
        <img
          alt={product.name}
          src={product.images?.[0] || `https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400`}
          onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/400?blur=2'; }}
          style={{ height: 200, objectFit: 'cover', width: '100%', borderRadius: 8 }}
        />
        {discount > 0 && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: '#ff4d4f', color: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
            -{discount}%
          </div>
        )}
      </div>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Còn: {product.stock}</Text>
              <Space>
                <Button size="small" icon={<HeartOutlined style={{ color: wished ? '#f5222d' : undefined }} />} onClick={(e) => { e.stopPropagation(); onAddToWishlist?.(product); }} />
                <Button type="primary" size="small" icon={<ShoppingCartOutlined />} onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}>
                  Thêm
                </Button>
              </Space>
            </div>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;






