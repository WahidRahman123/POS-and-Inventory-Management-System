const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const PurchaseReturn = require('../controllers/purchaseReturn');

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/purchase-return
// @desc show all purchase return with complete requirements
// @access private
router.get('/', protect, PurchaseReturn.index);

//* @route POST /api/purchase-return
// @desc create purchase-return
// @access private
router.post('/', protect, PurchaseReturn.createPurchaseReturn);

//* @route POST /api/purchase-return/:id/payment
// @desc search purchase-return between dates
// @access Private
router.post('/:id/payment', protect, PurchaseReturn.addPayment);

//* @route get /api/purchase-return/by-name
// @desc specific supplier purchase return details
// @access Private
router.get('/by-name', protect, PurchaseReturn.purchaseReturnBySupplierName);

//* @route GET /api/purchase-return/:id
// @desc fetch specific purchase-return
// @access Private
router.get('/:id', protect, PurchaseReturn.searchById);

module.exports = router;