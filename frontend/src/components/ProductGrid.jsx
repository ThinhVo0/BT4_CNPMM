import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Spin, Empty, message } from 'antd';
import ProductCard from './ProductCard';
import productApi from '../util/productApi';

const ProductGrid = ({ 
  categoryId, 
  searchTerm = null, 
  sortBy = 'createdAt', 
  sortOrder = 'desc',
  onAddToCart,
  onAddToWishlist 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  
  const observer = useRef();
  const lastProductRef = useRef();

  const lastProductCallback = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadProducts = useCallback(async (pageNum, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (searchTerm) {
        result = await productApi.searchProducts(searchTerm, categoryId, pageNum, 12);
      } else {
        result = await productApi.getProductsByCategory(categoryId, pageNum, 12, sortBy, sortOrder);
      }
      
      if (result.success) {
        const newProducts = result.data.products;
        
        if (append) {
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }
        
        setHasMore(result.data.pagination.hasNext);
      }
    } catch (err) {
      setError(err.message);
      message.error('Có lỗi xảy ra khi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [categoryId, searchTerm, sortBy, sortOrder]);

  // Reset khi thay đổi category hoặc search term
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadProducts(1, false);
  }, [categoryId, searchTerm, sortBy, sortOrder]);

  // Load thêm sản phẩm khi tăng page
  useEffect(() => {
    if (page > 1) {
      loadProducts(page, true);
    }
  }, [page]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Empty description="Không thể tải sản phẩm" />
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Empty description="Không có sản phẩm nào" />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {products.map((product, index) => {
          const isLastProduct = index === products.length - 1;
          
          return (
            <Col 
              xs={24} 
              sm={12} 
              md={8} 
              lg={6} 
              xl={6} 
              key={product._id}
              ref={isLastProduct ? lastProductCallback : null}
            >
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
              />
            </Col>
          );
        })}
      </Row>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      )}
      
      {!hasMore && products.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          Đã hiển thị tất cả sản phẩm
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
