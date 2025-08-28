import React from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '../util/api.js';

const ForgotPassword = () => {
  const onFinish = async (values) => {
    try {
      await api.post('/forgot-password', values);
      message.success('Reset email sent');
    } catch (error) {
      message.error(error.response?.data?.error || 'Error');
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Button type="primary" htmlType="submit">Send Reset Email</Button>
    </Form>
  );
};

export default ForgotPassword;