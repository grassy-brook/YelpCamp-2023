const express = require("express");
const router = express.Router();

const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

// Index
router.get('/', catchAsync(campgrounds.index));

// CreatePage
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// Detail
router.get('/:id', catchAsync(campgrounds.showCampground));

// Create
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// EditPage
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// Edit
router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
