const express = require("express");
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


router.route('/')
    // Index
    .get(catchAsync(campgrounds.index))
    // Create
    .post( isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// CreatePage
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    // Detail Page
    .get(catchAsync(campgrounds.showCampground))
    // Edit
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    // Delete
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

// EditPage
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
