import React, { useContext, useEffect, useState } from 'react';
import { Carousel, Card, Typography, Button, Space, Row, Col, Skeleton } from 'antd';
import { ShoppingOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context.jsx';
import productApi from '../util/productApi.js';

const { Title, Text } = Typography;

const heroBanners = [
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
    title: 'Săn Sale Siêu Sốc',
    subtitle: 'Giảm đến 50% cho điện thoại, laptop, tablet'
  },
  {
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop',
    title: 'Hàng Mới Về',
    subtitle: 'Siêu phẩm chính hãng, giá cực tốt'
  },
  {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
    title: 'Ưu Đãi Phụ Kiện',
    subtitle: 'Mua 2 tặng 1 cho hàng ngàn phụ kiện'
  }
];

const Home = () => {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productApi.getCategories();
        if (res.success) setCategories(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div style={{ background: '#f5f5f5' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Carousel autoplay dots draggable>
              {heroBanners.map((b, i) => (
                <div key={i}>
                  <div style={{
                    height: 320,
                    backgroundImage: `url(${b.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 12,
                  }}>
                    <div style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.15))',
                      borderRadius: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      paddingLeft: 32,
                      color: '#fff'
                    }}>
                      <Title level={2} style={{ color: '#fff', margin: 0 }}>{b.title}</Title>
                      <Text style={{ color: '#fff' }}>{b.subtitle}</Text>
                      <Link to="/products">
                        <Button type="primary" size="large" icon={<ShoppingOutlined />} style={{ marginTop: 16 }}>
                          Mua ngay
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </Col>

          <Col xs={24}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={3} style={{ marginTop: 8, marginBottom: 8 }}>Danh mục nổi bật</Title>
              </Col>

              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <Col xs={24} sm={12} md={12} lg={6} key={idx}>
                    <Card style={{ height: 140 }}>
                      <Skeleton active title={false} paragraph={{ rows: 3 }} />
                    </Card>
                  </Col>
                ))
              ) : (
                categories.slice(0, 4).map((cat) => (
                  <Col xs={24} sm={12} md={12} lg={6} key={cat._id}>
                    <Link to={`/products/category/${cat._id}`}>
                      <Card hoverable style={{ overflow: 'hidden' }} bodyStyle={{ padding: 12 }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <img src={cat.image || 'https://via.placeholder.com/80x80?text=IMG'} alt={cat.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                          <div>
                            <Title level={5} style={{ margin: 0 }}>{cat.name}</Title>
                            <Text type="secondary" style={{ fontSize: 12 }}>{cat.description}</Text>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </Col>
                ))
              )}
            </Row>
          </Col>

          <Col xs={24}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>Bắt đầu mua sắm</Title>
                  <Text type="secondary">Khám phá hàng ngàn sản phẩm chính hãng</Text>
                </div>
                <Link to="/products">
                  <Button type="primary" icon={<AppstoreOutlined />}>Xem tất cả sản phẩm</Button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;