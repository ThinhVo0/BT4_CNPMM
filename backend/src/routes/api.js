const express = require('express');
const { getHomepage } = require('../controllers/homeController.js');
const { handleCreateUser, handleLogin, handleForgotPassword, handleResetPassword, getAccount } = require('../controllers/userController.js');
const { verifyToken } = require('../middleware/auth.js');
const { delay } = require('../middleware/delay.js');
const productController = require('../controllers/productController.js');

const router = express.Router();

router.get('/', verifyToken, delay, getHomepage);
router.post('/register', handleCreateUser);
router.post('/login', handleLogin);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password/:token', handleResetPassword);
router.get('/account', verifyToken, getAccount);

// Product routes
router.get('/categories', productController.getAllCategories);
router.get('/categories/:categoryId/products', productController.getProductsByCategory);
router.get('/products/:productId', productController.getProductById);
router.get('/products/search', productController.searchProducts);

module.exports = router;