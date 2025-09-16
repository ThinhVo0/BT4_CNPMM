import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Rate, Tag, Space, Button, Breadcrumb, Card, Spin } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import productApi from '../util/productApi';
import { CartContext } from '../components/context/cart.context.jsx';
import { WishlistContext } from '../components/context/wishlist.context.jsx';

const { Title, Text } = Typography;

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productApi.getProductById(productId);
        if (res.success) setProduct(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  if (loading || !product) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  const priceFmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <div className="page-container">
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
          <Breadcrumb.Item>Danh mục</Breadcrumb.Item>
          <Breadcrumb.Item>{product.category?.name || 'Sản phẩm'}</Breadcrumb.Item>
        </Breadcrumb>

        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Quay lại</Button>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={10}>
            <Card>
              <img
                alt={product.name}
                src={product.images?.[0] || `https://picsum.photos/seed/${encodeURIComponent(product.name)}/600/600`}
                onError={(e) => { e.currentTarget.src = 'https://picsum.photos/600/600?blur=2'; }}
                style={{ width: '100%', borderRadius: 8 }}
              />
            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Title level={2} style={{ marginBottom: 0 }}>{product.name}</Title>
              <Space>
                <Rate disabled defaultValue={product.rating} />
                <Text type="secondary">({product.reviewCount})</Text>
              </Space>

              <div>
                <Text strong style={{ fontSize: 24, color: '#f5222d' }}>{priceFmt.format(product.price)}</Text>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Text delete type="secondary" style={{ marginLeft: 12 }}>{priceFmt.format(product.originalPrice)}</Text>
                )}
              </div>

              <Text>{product.description}</Text>
              <div>
                {product.tags?.map((t, i) => <Tag key={i}>{t}</Tag>)}
              </div>

              <Space>
                <Button size="large" type="primary" icon={<ShoppingCartOutlined />} onClick={() => addToCart(product)}>Thêm vào giỏ</Button>
                <Button size="large" icon={<HeartOutlined />} onClick={() => toggleWishlist(product)}>Yêu thích</Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default ProductDetail;


