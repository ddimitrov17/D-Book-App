const express = require('express');
const { signup, login, logout, validate } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const authRouter = express.Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.get('/logout',logout);
authRouter.get('/validate', authenticateToken, validate);

module.exports = {
    authRouter
} 