import React, { useContext } from 'react';
import { Layout, Space, Button, Badge, Avatar, Typography, Breadcrumb } from 'antd';
import { ShoppingCartOutlined, UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/auth.context.jsx';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../context/cart.context.jsx';
import { WishlistContext } from '../context/wishlist.context.jsx';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const { items: wishlistItems } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isProductsPage = location.pathname.startsWith('/products');

  return (
    <AntHeader style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100, paddingInline: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, maxWidth: 1280, margin: '0 auto' }}>
        <Link to={'/'} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/vite.svg" alt="Logo" width={34} height={34} />
          <Text strong style={{ fontSize: 18, color: '#141414' }}>UShop</Text>
        </Link>

        <div style={{ flex: 1 }} />

        <Space size="middle" align="center">
          <Link to="/products"><Button type={isProductsPage ? 'primary' : 'default'}>Sản phẩm</Button></Link>

          {isAuthenticated ? (
            <>
              <Link to="/wishlist">
                <Badge count={wishlistItems.length} size="small">
                  <Button>Yêu thích</Button>
                </Badge>
              </Link>
              <Link to="/cart">
                <Badge count={totalItems} size="small">
                  <Button icon={<ShoppingCartOutlined />} />
                </Badge>
              </Link>
              <Link to="/account">
                <Space>
                  <Avatar size={32} icon={<UserOutlined />} />
                  <Text>{user?.name || 'Tài khoản'}</Text>
                </Space>
              </Link>
              <Button danger icon={<LogoutOutlined />} onClick={logout}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button type="primary" icon={<LoginOutlined />}>Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button>Đăng ký</Button>
              </Link>
            </>
          )}
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;