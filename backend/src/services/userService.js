import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';  // Để tạo random token

const saltRounds = 10;

export const createUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error('Email already exists');
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  const newUser = new User({ ...data, password: hashedPassword });
  return await newUser.save();
};

export const loginUser = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) throw new Error('User not found');
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw new Error('Invalid password');
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { token, user: { id: user._id, name: user.name, email: user.email } };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 60000;  // 1 phút
  await user.save();

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Click this link: http://localhost:5173/reset-password/${resetToken}`
  };

  await transporter.sendMail(mailOptions);
  return { message: 'Reset email sent' };
};

export const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
  if (!user) throw new Error('Invalid or expired token');
  user.password = await bcrypt.hash(newPassword, saltRounds);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  return { message: 'Password reset successful' };
};

export const getUser = async (id) => {
  return await User.findById(id);
};