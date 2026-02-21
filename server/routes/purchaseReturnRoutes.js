const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const PruchaseReturn = require('../controllers/purchaseReturn');

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/purchase-return
// @desc show all purchase return with complete requirements
// @access private
router.get('/', protect, PruchaseReturn.index);

//* @route POST /api/purchase-return
// @desc create purchase-return
// @access private
router.post('/', protect, PruchaseReturn.createPurchaseReturn);

//* @route POST /api/purchase-return/:id/payment
// @desc search purchase-return between dates
// @access Private
router.post('/:id/payment', protect, PruchaseReturn.addPayment);

//* @route GET /api/purchase-return/:id
// @desc fetch specific purchase-return
// @access Private
router.get('/:id', protect, PruchaseReturn.searchById);

module.exports = router;