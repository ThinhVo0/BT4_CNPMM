import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CategoryList = ({ categories, selectedCategoryId, onCategorySelect }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      navigate(`/products/category/${category._id}`);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 12 }}>Danh mục sản phẩm</Title>
      <Row gutter={[12, 12]}>
        {categories.map((category) => (
          <Col xs={24} sm={12} key={category._id}>
            <Card
              hoverable
              onClick={() => handleCategoryClick(category)}
              style={{
                border: selectedCategoryId === category._id ? '2px solid #1677ff' : '1px solid #f0f0f0',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={category.image || 'https://picsum.photos/seed/category-' + encodeURIComponent(category.name) + '/120/120'}
                  alt={category.name}
                  onError={(e) => { e.currentTarget.src = 'https://picsum.photos/120/120?blur=2'; }}
                  style={{ width: 72, height: 72, borderRadius: 8, objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <Title level={5} style={{ margin: 0 }}>{category.name}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>{category.description}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryList;






