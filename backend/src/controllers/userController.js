import { createUser, loginUser, forgotPassword, resetPassword, getUser } from '../services/userService.js';

export const handleCreateUser = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleForgotPassword = async (req, res) => {
  try {
    const data = await forgotPassword(req.body.email);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleResetPassword = async (req, res) => {
  try {
    const data = await resetPassword(req.params.token, req.body.password);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAccount = async (req, res) => {
  try {
    const user = await getUser(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};