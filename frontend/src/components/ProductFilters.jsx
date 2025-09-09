import React, { useState, useEffect } from 'react';
import { Card, Select, Input, Space, Typography, Row, Col, Slider, Checkbox, Button, Collapse } from 'antd';
import { SearchOutlined, SortAscendingOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import SearchAutocomplete from './SearchAutocomplete';

const { Option } = Select;
const { Search } = Input;
const { Title } = Typography;
const { Panel } = Collapse;

const ProductFilters = ({ 
  searchTerm, 
  onSearchChange, 
  sortBy, 
  sortOrder, 
  onSortChange,
  onSortOrderChange,
  filters = {},
  onFiltersChange,
  categories = [],
  onSearch,
  loading = false
}) => {
  const [localFilters, setLocalFilters] = useState({
    category: filters.category || null,
    minPrice: filters.minPrice || null,
    maxPrice: filters.maxPrice || null,
    minRating: filters.minRating || null,
    hasDiscount: filters.hasDiscount || null,
    minDiscount: filters.minDiscount || null,
    inStock: filters.inStock || null
  });

  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [ratingRange, setRatingRange] = useState([0, 5]);

  const sortOptions = [
    { value: 'createdAt', label: 'Mới nhất' },
    { value: 'price', label: 'Giá' },
    { value: 'name', label: 'Tên sản phẩm' },
    { value: 'rating', label: 'Đánh giá' },
    { value: 'reviewCount', label: 'Số đánh giá' },
    { value: 'viewCount', label: 'Lượt xem' },
    { value: 'discount', label: 'Khuyến mãi' }
  ];

  const orderOptions = [
    { value: 'desc', label: 'Giảm dần' },
    { value: 'asc', label: 'Tăng dần' }
  ];

  // Cập nhật local filters khi props thay đổi
  useEffect(() => {
    setLocalFilters({
      category: filters.category || null,
      minPrice: filters.minPrice || null,
      maxPrice: filters.maxPrice || null,
      minRating: filters.minRating || null,
      hasDiscount: filters.hasDiscount || null,
      minDiscount: filters.minDiscount || null,
      inStock: filters.inStock || null
    });
  }, [filters]);

  // Xử lý thay đổi filter
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange && onFiltersChange(newFilters);
  };

  // Reset tất cả filters
  const handleResetFilters = () => {
    const resetFilters = {
      category: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      hasDiscount: null,
      minDiscount: null,
      inStock: null
    };
    setLocalFilters(resetFilters);
    onFiltersChange && onFiltersChange(resetFilters);
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    onSearch && onSearch();
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      {/* Tìm kiếm và sắp xếp cơ bản */}
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ marginBottom: 8 }}>
            <SearchOutlined /> Tìm kiếm
          </Title>
          <SearchAutocomplete
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={handleSearch}
            placeholder="Tìm kiếm sản phẩm..."
            loading={loading}
            style={{ width: '100%' }}
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
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
        
        <Col xs={24} sm={12} md={6}>
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

        <Col xs={24} sm={12} md={6}>
          <Space>
            <Button 
              type="primary" 
              onClick={handleSearch}
              loading={loading}
              icon={<SearchOutlined />}
            >
              Tìm kiếm
            </Button>
            <Button 
              onClick={handleResetFilters}
              icon={<ReloadOutlined />}
            >
              Reset
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Bộ lọc nâng cao */}
      <Collapse ghost>
        <Panel 
          header={
            <Title level={5} style={{ margin: 0 }}>
              <FilterOutlined /> Bộ lọc nâng cao
            </Title>
          } 
          key="1"
        >
          <Row gutter={[16, 16]}>
            {/* Lọc theo danh mục */}
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ marginBottom: 8 }}>Danh mục</Title>
              <Select
                value={localFilters.category}
                onChange={(value) => handleFilterChange('category', value)}
                style={{ width: '100%' }}
                placeholder="Chọn danh mục"
                allowClear
              >
                {categories.map(category => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Col>

            {/* Lọc theo giá */}
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ marginBottom: 8 }}>Khoảng giá</Title>
              <div style={{ padding: '0 12px' }}>
                <Slider
                  range
                  min={0}
                  max={10000000}
                  step={100000}
                  value={[localFilters.minPrice || 0, localFilters.maxPrice || 10000000]}
                  onChange={(value) => {
                    handleFilterChange('minPrice', value[0]);
                    handleFilterChange('maxPrice', value[1]);
                  }}
                  tooltip={{
                    formatter: (value) => `${value?.toLocaleString('vi-VN')} VNĐ`
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                  <span>{localFilters.minPrice?.toLocaleString('vi-VN') || '0'} VNĐ</span>
                  <span>{localFilters.maxPrice?.toLocaleString('vi-VN') || '10,000,000'} VNĐ</span>
                </div>
              </div>
            </Col>

            {/* Lọc theo đánh giá */}
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ marginBottom: 8 }}>Đánh giá tối thiểu</Title>
              <Select
                value={localFilters.minRating}
                onChange={(value) => handleFilterChange('minRating', value)}
                style={{ width: '100%' }}
                placeholder="Chọn đánh giá"
                allowClear
              >
                <Option value={4}>4+ sao</Option>
                <Option value={3}>3+ sao</Option>
                <Option value={2}>2+ sao</Option>
                <Option value={1}>1+ sao</Option>
              </Select>
            </Col>

            {/* Lọc theo khuyến mãi */}
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ marginBottom: 8 }}>Khuyến mãi</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Checkbox
                  checked={localFilters.hasDiscount === true}
                  onChange={(e) => handleFilterChange('hasDiscount', e.target.checked ? true : null)}
                >
                  Có khuyến mãi
                </Checkbox>
                <Select
                  value={localFilters.minDiscount}
                  onChange={(value) => handleFilterChange('minDiscount', value)}
                  style={{ width: '100%' }}
                  placeholder="Mức khuyến mãi tối thiểu"
                  allowClear
                >
                  <Option value={10}>10% trở lên</Option>
                  <Option value={20}>20% trở lên</Option>
                  <Option value={30}>30% trở lên</Option>
                  <Option value={50}>50% trở lên</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default ProductFilters;



