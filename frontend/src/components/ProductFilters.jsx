import React from 'react';
import { Card, Select, Input, Space, Typography, Row, Col } from 'antd';
import { SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;

const ProductFilters = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  sortOrder, 
  onSortChange,
  onSortOrderChange 
}) => {
  const sortOptions = [
    { value: 'createdAt', label: 'Mới nhất' },
    { value: 'price', label: 'Giá' },
    { value: 'name', label: 'Tên sản phẩm' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'reviewCount', label: 'Số đánh giá' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'Giảm dần' },
    { value: 'asc', label: 'Tăng dần' }
  ];

  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Title level={5} style={{ marginBottom: 8 }}>
            <SearchOutlined /> Tìm kiếm
          </Title>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            style={{ width: '100%' }}
          />
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Title level={5} style={{ marginBottom: 8 }}>
            <SortAscendingOutlined /> Sắp xếp theo
          </Title>
          <Select
            value={sortBy}
            onChange={onSortChange}
            style={{ width: '100%' }}
            placeholder="Chọn tiêu chí sắp xếp"
          >
            {sortOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Title level={5} style={{ marginBottom: 8 }}>
            Thứ tự
          </Title>
          <Select
            value={sortOrder}
            onChange={onSortOrderChange}
            style={{ width: '100%' }}
            placeholder="Chọn thứ tự"
          >
            {orderOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFilters;
