import React, { useContext } from 'react';
import { Menu } from 'antd';
import { AuthContext } from '../context/auth.context.jsx';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  return (
    <Menu mode="horizontal">
      <Menu.Item key="home"><Link to="/">Home</Link></Menu.Item>
      {isAuthenticated ? (
        <>
          <Menu.Item key="account"><Link to="/account">Account ({user?.name})</Link></Menu.Item>
          <Menu.Item key="logout" onClick={logout}>Logout</Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login"><Link to="/login">Login</Link></Menu.Item>
          <Menu.Item key="register"><Link to="/register">Register</Link></Menu.Item>
          <Menu.Item key="forgot"><Link to="/forgot-password">Forgot Password</Link></Menu.Item>
        </>
      )}
    </Menu>
  );
};

export default Header;