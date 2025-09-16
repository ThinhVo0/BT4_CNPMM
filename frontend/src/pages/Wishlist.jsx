import React, { useContext } from 'react';
import { WishlistContext } from '../components/context/wishlist.context.jsx';
import { Row, Col, Card, Typography, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Wishlist = () => {
  const { items, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Title level={2}>Yêu thích</Title>
      {items.length === 0 ? (
        <Text type="secondary">Chưa có sản phẩm nào.</Text>
      ) : (
        <Row gutter={[16, 16]}>
          {items.map((it) => (
            <Col xs={24} md={8} key={it._id}>
              <Card hoverable onClick={() => navigate(`/products/${it._id}`)}>
                <img src={it.images?.[0]} alt={it.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }} />
                <Title level={5} style={{ marginTop: 12 }}>{it.name}</Title>
                <Button type="link" icon={<DeleteOutlined />} danger onClick={(e) => { e.stopPropagation(); toggleWishlist(it); }}>Bỏ yêu thích</Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Wishlist;


