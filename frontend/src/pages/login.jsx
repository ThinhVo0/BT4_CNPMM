import React, { useContext } from 'react';
import { Form, Input, Button, message, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import api from '../util/api.js';
import { AuthContext } from '../components/context/auth.context.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const { Title, Text } = Typography;

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { data } = await api.post('/login', values);
      login(data.token, data.user);
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="auth-content">
        <Card className="auth-card" bordered={false}>
          <div className="auth-header">
            <div className="auth-logo">
              <UserOutlined className="logo-icon" />
            </div>
            <Title level={2} className="auth-title">Đăng nhập</Title>
            <Text className="auth-subtitle">Chào mừng bạn quay trở lại!</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className="auth-form"
            size="large"
          >
            <Form.Item 
              name="email" 
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="input-icon" />}
                placeholder="Email của bạn"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Mật khẩu"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item className="auth-form-item">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="auth-button"
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <Divider className="auth-divider">
            <Text className="divider-text">hoặc</Text>
          </Divider>

          <div className="auth-footer">
            <Text className="auth-footer-text">
              Chưa có tài khoản? 
              <Link to="/register" className="auth-link">
                Đăng ký ngay
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;