const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const purchases = require('../controllers/purchase');

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/purchase
// @desc show all purchase with complete requirements
// @access private
router.get('/', protect, purchases.index);

//* @route POST /api/purchase
// @desc create purchases
// @access private
router.post('/', protect, purchases.createPurchase);

//* @route POST /api/purchase/:id/payment
// @desc search sales between dates
// @access Private
router.post('/:id/payment', protect, purchases.addPayment);

//* @route GET /api/purchase/:id
// @desc fetch specific sale
// @access Private
router.get('/:id', protect, purchases.searchById);

module.exports = router;