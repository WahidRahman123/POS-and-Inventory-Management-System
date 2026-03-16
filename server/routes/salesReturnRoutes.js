const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const salesReturn = require('../controllers/salesReturn');

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/sales-return
// @desc show all sales return with complete requirements
// @access private
router.get('/', protect, salesReturn.index);

//* @route GET /api/sales-return/sales-by-invoice
// @desc get the specific sales return 
// @access private
router.get('/sales-by-invoice', protect, salesReturn.saleByInvoice);

//* @route POST /api/sales-return
// @desc create sales return
// @access private
router.post('/', protect, salesReturn.createSalesReturn);

//* @route POST /api/sales-return/:id/exchange-payment
//* This is the update or edit for the sales return
// @desc add payment by exchange
// @access Private
router.post('/:id/exchange-payment', protect, salesReturn.addPaymentByExchange);

//* @route get /api/sales-return/by-name
// @desc specific customer sales return details
// @access Private
router.get('/by-name', protect, salesReturn.salesReturnStatement);

//* @route POST /api/sales-return/:id/cash-payment
//* This is the update or edit for the sales return
// @desc add payment by exchange
// @access Private
router.post('/:id/cash-payment', protect, salesReturn.addPaymentByCash);

//* @route GET /api/sales-return/:id
// @desc fetch specific sales Return
// @access Private
router.get('/:id', protect, admin, salesReturn.salesReturnById);


module.exports = router;