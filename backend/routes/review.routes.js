const express = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { createReview, getReadingListAndFavorites, getReviewsInFeed, getReviewsOfUser, getReviewById } = require('../controllers/review.controller');

const reviewRouter = express.Router();

reviewRouter.post('/create-review', authenticateToken, createReview);
reviewRouter.get('/get-reading-list-and-favorites', authenticateToken, getReadingListAndFavorites);
reviewRouter.get('/get-reviews-in-feed', authenticateToken, getReviewsInFeed);
reviewRouter.get('/get-reviews-of-user', authenticateToken, getReviewsOfUser);
reviewRouter.get('/get-review/:id',getReviewById)

module.exports = {
    reviewRouter
} 