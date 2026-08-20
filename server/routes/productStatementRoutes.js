const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const productStatement = require('../controllers/productStatement');

const router = express.Router();

//* @route GET /api/product-statement
// @desc All Sales fetch
// @access Private
router.get('/', protect, productStatement.index);

//* @route POST /api/product-statement
// @desc Create product-statement
// @access Private
// router.post('/',  protect, productStatement.createdProductStatement);

module.exports = router;