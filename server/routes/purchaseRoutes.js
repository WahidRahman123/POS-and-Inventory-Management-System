const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const purchases = require('../controllers/purchase');

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/purchase
// @desc show all purchase with complete requirements
// @access private
router.get('/', purchases.index);

//* @route POST /api/purchase
// @desc create purchases
// @access private
router.post('/', purchases.createPurchase);

module.exports = router;