import express from 'express';
import { getHomepage } from '../controllers/homeController.js';
import { handleCreateUser, handleLogin, handleForgotPassword, handleResetPassword, getAccount } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { delay } from '../middleware/delay.js';

const router = express.Router();

router.get('/', verifyToken, delay, getHomepage);
router.post('/register', handleCreateUser);
router.post('/login', handleLogin);
router.post('/forgot-password', handleForgotPassword);
router.post('/reset-password/:token', handleResetPassword);
router.get('/account', verifyToken, getAccount);

export default router;