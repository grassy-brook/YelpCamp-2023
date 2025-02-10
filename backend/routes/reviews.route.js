import express from 'express';
const router = express.Router({ mergeParams: true });

import { isLoggedIn, isReviewAuthor } from '../middleware.js';
import catchAsync from '../utils/catchAsync.js';
import reviews from '../controllers/reviews.controller.js';

// Create
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
