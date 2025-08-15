const express = require('express');
const Category = require('../models/Category');
const protect = require('../middleware/authMiddleware');
const categories = require('../controllers/categories');


const router = express.Router();

//! Add protect to all

//* @route GET /api/categories without limit
// @desc All category fetch
// @access Private
router.get('/', categories.index);

//* @route GET /api/categories with limit
// @desc All category fetch
// @access Private
router.get('/limit', categories.indexWithLimit);

//* @route GET /api/categories/search
// @desc category fetching using search
// @access Private
router.get('/search', categories.searchCategory);

//* @route POST /api/categories
// @desc create category list
// @access Private
router.post('/', categories.createCategory);

//* @route GET /api/categories/:id
// @desc show specific category 
// @access Private
router.get('/:id', categories.showCategory);


//* @route PUT /api/categories/:id
// @desc create category list
// @access Private
router.put('/:id', categories.updateCategory);


//* @route Delete /api/categories/:id
// @desc delete specific category
// access Private
router.delete('/:id', categories.deleteCategory);


module.exports = router;