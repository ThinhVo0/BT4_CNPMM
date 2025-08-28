import React, { useContext } from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '../util/api.js';
import { AuthContext } from '../components/context/auth.context.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { data } = await api.post('/login', values);
      login(data.token, data.user);
      message.success('Logged in');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.error || 'Error');
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Button type="primary" htmlType="submit">Login</Button>
    </Form>
  );
};

export default Login;