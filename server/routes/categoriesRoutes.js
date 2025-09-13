const express = require('express');
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/authMiddleware');
const categories = require('../controllers/categories');


const router = express.Router();

//* @route GET /api/categories without limit
// @desc All category fetch
// @access Private
router.get('/', protect, categories.index);

//* @route GET /api/categories/limit with limit
// @desc All category fetch
// @access Private
router.get('/limit', protect, categories.indexWithLimit);

//* @route GET /api/categories/name with name
// @desc All category name fetch
// @access Private
router.get('/name', protect, categories.indexWithName);

//* @route GET /api/categories/search
// @desc category fetching using search
// @access Private
router.get('/search', protect, categories.searchCategory);

//* @route POST /api/categories
// @desc create category list
// @access Private
router.post('/', protect, categories.createCategory);

//* @route GET /api/categories/:id
// @desc show specific category 
// @access Private
router.get('/:id', protect, categories.showCategory);


//* @route PUT /api/categories/:id
// @desc create category list
// @access Private
router.put('/:id', protect, categories.updateCategory);


//* @route Delete /api/categories/:id
// @desc delete specific category
// access Private
router.delete('/:id', protect, categories.deleteCategory);


module.exports = router;