const express = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { createReview, getReadingListAndFavorites } = require('../controllers/review.controller');

const reviewRouter = express.Router();

reviewRouter.post('/create-review', authenticateToken, createReview);
reviewRouter.get('/get-reading-list-and-favorites', authenticateToken, getReadingListAndFavorites);

module.exports = {
    reviewRouter
} 