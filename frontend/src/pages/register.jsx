import React from 'react';
import { Form, Input, Button, message, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import api from '../util/api.js';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await api.post('/register', values);
      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.error || 'Đăng ký thất bại');
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
              <UserAddOutlined className="logo-icon" />
            </div>
            <Title level={2} className="auth-title">Đăng ký</Title>
            <Text className="auth-subtitle">Tạo tài khoản mới để bắt đầu!</Text>
          </div>

          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            className="auth-form"
            size="large"
          >
            <Form.Item 
              name="name" 
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên!' },
                { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Họ và tên"
                className="auth-input"
              />
            </Form.Item>

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

            <Form.Item 
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Xác nhận mật khẩu"
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
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <Divider className="auth-divider">
            <Text className="divider-text">hoặc</Text>
          </Divider>

          <div className="auth-footer">
            <Text className="auth-footer-text">
              Đã có tài khoản? 
              <Link to="/login" className="auth-link">
                Đăng nhập ngay
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;