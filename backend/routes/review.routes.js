const express = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { createReview, getReadingListAndFavorites, getReviewsInFeed } = require('../controllers/review.controller');

const reviewRouter = express.Router();

reviewRouter.post('/create-review', authenticateToken, createReview);
reviewRouter.get('/get-reading-list-and-favorites', authenticateToken, getReadingListAndFavorites);
reviewRouter.get('/get-reviews-in-feed', authenticateToken, getReviewsInFeed);

module.exports = {
    reviewRouter
} 