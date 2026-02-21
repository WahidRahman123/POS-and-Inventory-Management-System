const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const ProductExchange = require('../controllers/productExchange');

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/product-exchange
// @desc show all exchange with complete requirements
// @access private
router.get('/', protect, ProductExchange.index);

//* @route POST /api/product-exchange
// @desc create exchanges
// @access private
router.post('/', protect, ProductExchange.createProductExchange);

//* @route GET /api/product-exchange/memo
// @desc fetch specific exchange
// @access Private
router.get('/memo', protect, ProductExchange.searchByMemo);

module.exports = router;