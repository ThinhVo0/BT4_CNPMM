import React, { useContext, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { AuthContext } from './components/context/auth.context.jsx';
import Header from './components/layout/header.jsx';

// Lazy load all pages
const Home = React.lazy(() => import('./pages/home.jsx'));
const Login = React.lazy(() => import('./pages/login.jsx'));
const Register = React.lazy(() => import('./pages/register.jsx'));
const ForgotPassword = React.lazy(() => import('./pages/forgotPassword.jsx'));
const ResetPassword = React.lazy(() => import('./pages/resetPassword.jsx'));
const Products = React.lazy(() => import('./pages/Products.jsx'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail.jsx'));
const Cart = React.lazy(() => import('./pages/Cart.jsx'));
const Wishlist = React.lazy(() => import('./pages/Wishlist.jsx'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh',
    flexDirection: 'column',
    gap: '16px'
  }}>
    <Spin size="large" />
    <div style={{ color: '#666', fontSize: '16px' }}>Đang tải trang...</div>
  </div>
);

const App = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Spin size="large" />
        <div style={{ color: '#666', fontSize: '16px' }}>Đang khởi tạo ứng dụng...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" />} />
          <Route path="/reset-password/:token" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/" />} />
          <Route path="/products" element={isAuthenticated ? <Products /> : <Navigate to="/login" />} />
          <Route path="/products/category/:categoryId" element={isAuthenticated ? <Products /> : <Navigate to="/login" />} />
          <Route path="/products/:productId" element={isAuthenticated ? <ProductDetail /> : <Navigate to="/login" />} />
          <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/wishlist" element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;