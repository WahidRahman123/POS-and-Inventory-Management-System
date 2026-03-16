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
// @desc create purchase return
// @access private
router.post('/', protect, PurchaseReturn.createPurchaseReturn);

//* @route GET /api/purchase-return/purchases-by-invoice
// @desc get the specific purchase return 
// @access private
router.get('/purchases-by-invoice', protect, PurchaseReturn.purchaseByInvoice);

//* @route POST /api/purchase-return/:id/exchange-payment
//* This is the update or edit for the sales return
// @desc add payment by exchange
// @access Private
router.post('/:id/exchange-payment', protect, PurchaseReturn.addPaymentByExchange);

//* @route get /api/purchase-return/by-name
// @desc specific supplier purchase return details
// @access Private
router.get('/by-name', protect, PurchaseReturn.purchaseReturnStatement);

//* @route POST /api/purchase-return/:id/cash-payment
//* This is the update or edit for the sales return
// @desc add payment by exchange
// @access Private
router.post('/:id/cash-payment', protect, PurchaseReturn.addPaymentByCash);

//* @route GET /api/purchase-return/:id
// @desc fetch specific purchase Return
// @access Private
router.get('/:id', protect, admin, PurchaseReturn.purchaseReturnById);

module.exports = router;