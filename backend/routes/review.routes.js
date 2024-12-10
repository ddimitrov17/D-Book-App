const express = require('express');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { createReview, getReviewsInFeed, getReviewsOfUser, getReviewById, updateReview, 
    deleteReview, addOrRemoveToReadingList, addOrRemoveToFavoritesShelf, 
    getStateOfReadingAndFavorites, getReadingList, getFavoritesShelf, 
    getUserLikes,
    likeUnlikeReview,
    getTheNMostLikedReviews} = require('../controllers/review.controller');

const reviewRouter = express.Router();

reviewRouter.post('/create-review', authenticateToken, createReview);
reviewRouter.get('/get-reviews-in-feed', authenticateToken, getReviewsInFeed);
reviewRouter.get('/get-reviews-of-user', authenticateToken, getReviewsOfUser);
reviewRouter.get('/get-review/:id',getReviewById)
reviewRouter.put('/update-review/:id', authenticateToken, updateReview);
reviewRouter.delete('/delete-review/:id', authenticateToken, deleteReview);

reviewRouter.post('/interact-with-reading-list',authenticateToken,addOrRemoveToReadingList);
reviewRouter.post('/interact-with-favorites-shelf',authenticateToken,addOrRemoveToFavoritesShelf);
reviewRouter.get('/get-state-of-reading-and-favorites/:id',authenticateToken,getStateOfReadingAndFavorites);

reviewRouter.get('/get-reading-list',authenticateToken,getReadingList);
reviewRouter.get('/get-favorites-shelf',authenticateToken,getFavoritesShelf);

reviewRouter.get('/get-user-likes',authenticateToken,getUserLikes);
reviewRouter.post('/like-review',authenticateToken,likeUnlikeReview);

reviewRouter.post('/get-most-liked',getTheNMostLikedReviews);

module.exports = {
    reviewRouter
} 