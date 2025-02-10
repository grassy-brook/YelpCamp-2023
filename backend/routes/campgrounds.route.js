import express from 'express';
import multer from 'multer';

import campgrounds from '../controllers/campgrounds.controller.js';
import catchAsync from '../utils/catchAsync.js';
import { isLoggedIn, isAuthor, validateCampground } from '../middleware.js';
import { storage } from '../cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router
    .route('/')
    // Index
    .get(catchAsync(campgrounds.index))
    // Create
    .post(
        isLoggedIn,
        upload.array('image'),
        validateCampground,
        catchAsync(campgrounds.createCampground)
    );

// CreatePage
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router
    .route('/:id')
    // Detail Page
    .get(catchAsync(campgrounds.showCampground))
    // Edit
    .put(
        isLoggedIn,
        isAuthor,
        upload.array('image'),
        validateCampground,
        catchAsync(campgrounds.updateCampground)
    )
    // Delete
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// EditPage
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
