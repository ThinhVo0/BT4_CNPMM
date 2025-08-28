import React from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '../util/api.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await api.post('/register', values);
      message.success('Registered successfully');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.error || 'Error');
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="name" rules={[{ required: true }]}>
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Button type="primary" htmlType="submit">Register</Button>
    </Form>
  );
};

export default Register;