import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  resetToken: String,  // Để lưu token reset password
  resetTokenExpiry: Date  // Thời hạn token
});

export default mongoose.model('User', userSchema);