import React from 'react';
import { Form, Input, Button, message } from 'antd';
import api from '../util/api.js';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await api.post(`/reset-password/${token}`, { password: values.password });
      message.success('Password reset');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.error || 'Error');
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="password" rules={[{ required: true }]}>
        <Input.Password placeholder="New Password" />
      </Form.Item>
      <Button type="primary" htmlType="submit">Reset Password</Button>
    </Form>
  );
};

export default ResetPassword;