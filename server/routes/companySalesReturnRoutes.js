const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const companySalesReturn = require('../controllers/companySalesReturn');

const router = express.Router();

//* @route GET /api/company-sales-return
// @desc show all company-sales-return with complete requirements
// @access private
router.get('/', protect, companySalesReturn.index);

//* @route POST /api/company-sales-return
// @desc create company sales Return
// @access private
router.post('/', protect, companySalesReturn.createCompanySalesReturn);

//* @route get /api/company-sales-return/statement-by-name
// @desc specific company sales return statement details
// @access Private
router.get('/statement-by-name', protect, companySalesReturn.companySalesReturnStatement);

//* @route get /api/company-sales-return/sales-return-report
// @desc specific company sales return statement details
// @access Private
router.get('/sales-return-report', protect, companySalesReturn.salesReturnReport);

//* @route get /api/company-sales-return/search-by-product-name
// @desc sales return searched by product name
// @access Private
router.get('/search-by-product-name', protect, companySalesReturn.salesReturnStockSearchedByProductName);

//* @route POST /api/company-sales-return/:id/payment
// @desc add payment
// @access Private
router.post('/:id/payment', protect, companySalesReturn.addPayment);

//* @route GET /api/company-sales-return/:id
// @desc fetch specific company-sales-return
// @access Private
router.get('/:id', protect, companySalesReturn.searchById);

module.exports = router;