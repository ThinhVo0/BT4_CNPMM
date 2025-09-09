import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import searchApi from '../util/searchApi';

const { Search } = Input;

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

  // Debounced search for suggestions
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value && value.length >= 2) {
      timeoutRef.current = setTimeout(async () => {
        try {
          setIsLoading(true);
          const result = await searchApi.getSuggestions(value, 5);
          
          if (result.success && result.data.length > 0) {
            const suggestionOptions = result.data.map(item => ({
              value: item.text,
              label: item.text
            }));
            setSuggestions(suggestionOptions);
            setOptions(suggestionOptions);
          } else {
            setSuggestions([]);
            setOptions([]);
          }
        } catch (error) {
          console.error('Error getting suggestions:', error);
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

  const handleSearch = (searchValue) => {
    onSearch && onSearch(searchValue);
  };

  const handleSelect = (selectedValue) => {
    onChange && onChange(selectedValue);
    handleSearch(selectedValue);
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
      notFoundContent={isLoading ? "Đang tìm kiếm..." : "Không tìm thấy gợi ý"}
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
