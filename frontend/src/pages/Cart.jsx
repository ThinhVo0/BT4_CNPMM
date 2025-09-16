import React, { useContext } from 'react';
import { CartContext } from '../components/context/cart.context.jsx';
import { Row, Col, Card, Typography, Button, Space, InputNumber } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const format = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="page-container">
      <Title level={2}>Giỏ hàng</Title>
      {items.length === 0 ? (
        <Text type="secondary">Chưa có sản phẩm nào.</Text>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {items.map((it) => (
              <Col xs={24} md={12} key={it._id}>
                <Card>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <img src={it.images?.[0]} alt={it.name} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <Title level={5} style={{ margin: 0 }}>{it.name}</Title>
                      <Text>{format.format(it.price)} x </Text>
                      <InputNumber min={1} value={it.quantity} onChange={(v) => updateQuantity(it._id, v)} />
                      <div>
                        <Button type="link" icon={<DeleteOutlined />} danger onClick={() => removeFromCart(it._id)}>Xóa</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Card style={{ marginTop: 16 }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Title level={4} style={{ margin: 0 }}>Tổng: {format.format(total)}</Title>
              <Button danger onClick={clearCart}>Xóa giỏ hàng</Button>
            </Space>
          </Card>
        </>
      )}
    </div>
  );
};

export default Cart;


