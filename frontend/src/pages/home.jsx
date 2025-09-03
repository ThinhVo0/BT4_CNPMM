import React, { useContext } from 'react';
import { Card, Typography, Button, Space, Row, Col } from 'antd';
import { ShoppingOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context.jsx';

const { Title, Text } = Typography;

const Home = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Title level={2}>
                <HomeOutlined /> Chào mừng bạn đến với Shop Online!
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Khám phá các sản phẩm chất lượng với giá tốt nhất
              </Text>
              
              <div style={{ marginTop: '32px' }}>
                <Space size="large">
                  <Link to="/products">
                    <Button type="primary" size="large" icon={<ShoppingOutlined />}>
                      Xem sản phẩm
                    </Button>
                  </Link>
                  <Button size="large" icon={<UserOutlined />}>
                    Cập nhật thông tin
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3} style={{ margin: '16px 0 8px 0' }}>
                {user?.name || 'Võ Nguyễn Xuân Thịnh'}
              </Title>
              <Text type="secondary">
                {user?.email || '22110429@student.hcmute.edu.vn'}
              </Text>
              
              <div style={{ marginTop: '24px' }}>
                <Text type="secondary">
                  Thành viên từ: {new Date().toLocaleDateString('vi-VN')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;