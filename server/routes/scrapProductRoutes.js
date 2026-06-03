const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const users = require('../controllers/users');
const scrapProducts = require('../controllers/scrapProducts');

const router = express.Router();

//* @route GET /api/scrap-product
// @desc fetch scrap product by productName
// @access Private
router.get('/', protect, admin, scrapProducts.searchForScrapProduct);

//* @route POST /api/scrap-product
// @desc Create scrap products 
// @access Private
router.post('/', protect, admin, scrapProducts.createScrapProducts);

module.exports = router;