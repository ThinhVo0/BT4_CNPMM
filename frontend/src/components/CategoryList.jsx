import React from 'react';
import { Card, Typography, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const CategoryList = ({ categories, selectedCategoryId, onCategorySelect }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      // Nếu không có callback, navigate đến trang sản phẩm
      navigate(`/products/category/${category._id}`);
    }
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Danh mục sản phẩm
      </Title>
      
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {categories.map((category) => (
          <Card
            key={category._id}
            hoverable
            size="small"
            onClick={() => handleCategoryClick(category)}
            style={{
              cursor: 'pointer',
              border: selectedCategoryId === category._id ? '2px solid #1890ff' : '1px solid #f0f0f0',
              backgroundColor: selectedCategoryId === category._id ? '#f6ffed' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={category.image || 'https://via.placeholder.com/60x60?text=Category'}
                alt={category.name}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ margin: 0, color: selectedCategoryId === category._id ? '#1890ff' : 'inherit' }}>
                  {category.name}
                </Title>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {category.description}
                </Text>
              </div>
            </div>
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default CategoryList;



