const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop_db';
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = { connectToDatabase };