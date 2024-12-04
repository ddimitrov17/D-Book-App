const express = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { createReview } = require('../controllers/review.controller');

const reviewRouter = express.Router();

reviewRouter.post('/create-review', authenticateToken, createReview);

module.exports = {
    reviewRouter
} 