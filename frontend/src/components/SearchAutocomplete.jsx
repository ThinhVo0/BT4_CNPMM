import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete, Input, Card, Typography, Image, Space } from 'antd';
import { SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import searchApi from '../util/searchApi';

const { Search } = Input;
const { Text } = Typography;

const SearchAutocomplete = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Tìm kiếm sản phẩm...",
  loading = false,
  style = {}
}) => {
  const [options, setOptions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search for product suggestions
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value && value.length >= 2) {
      timeoutRef.current = setTimeout(async () => {
        try {
          setIsLoading(true);
          // Sử dụng search API thay vì suggestions để lấy thông tin sản phẩm
          const result = await searchApi.searchProducts({
            q: value,
            page: 1,
            limit: 5
          });
          
          if (result.success && result.data.products.length > 0) {
            const productOptions = result.data.products.map(product => {
              console.log('Creating option for product:', product._id, product.name); // Debug log
              return {
                value: product.name,
                label: (
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '8px 0',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Direct click on product:', product._id); // Debug log
                      handleProductClick(product);
                    }}
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={40}
                      height={40}
                      style={{ borderRadius: '4px', objectFit: 'cover' }}
                      preview={false}
                    />
                    <div style={{ marginLeft: '12px', flex: 1 }}>
                      <Text strong style={{ fontSize: '14px', display: 'block' }}>
                        {product.name}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {product.category.name} • {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(product.price)}
                      </Text>
                    </div>
                  </div>
                ),
                product: product
              };
            });
            setSuggestions(productOptions);
            setOptions(productOptions);
          } else {
            setSuggestions([]);
            setOptions([]);
          }
        } catch (error) {
          console.error('Error getting product suggestions:', error);
          setSuggestions([]);
          setOptions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setOptions([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  const handleProductClick = (product) => {
    // Navigate to product detail page
    navigate(`/products/${product._id}`);
  };

  const handleSearch = (searchValue) => {
    onSearch && onSearch(searchValue);
  };

  const handleSelect = (selectedValue, option) => {
    console.log('Selected:', selectedValue, option); // Debug log
    
    // If a product was selected, navigate to product detail
    if (option && option.product) {
      console.log('Navigating to product:', option.product._id); // Debug log
      // Clear the input
      onChange && onChange('');
      // Navigate to product detail
      handleProductClick(option.product);
    } else {
      // Otherwise, perform regular search
      onChange && onChange(selectedValue);
      handleSearch(selectedValue);
    }
  };

  const handleChange = (changedValue) => {
    onChange && onChange(changedValue);
  };

  return (
    <AutoComplete
      value={value}
      options={options}
      onSelect={handleSelect}
      onChange={handleChange}
      style={{ width: '100%', ...style }}
      dropdownMatchSelectWidth={true}
      dropdownStyle={{
        maxHeight: '400px',
        overflow: 'auto'
      }}
      notFoundContent={isLoading ? "Đang tìm kiếm..." : "Không tìm thấy sản phẩm"}
      filterOption={false} // Disable client-side filtering since we're using server-side search
      onDropdownVisibleChange={(open) => {
        if (!open) {
          // Reset options when dropdown closes
          setOptions([]);
        }
      }}
    >
      <Search
        placeholder={placeholder}
        onSearch={handleSearch}
        loading={loading || isLoading}
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
      />
    </AutoComplete>
  );
};

export default SearchAutocomplete;
