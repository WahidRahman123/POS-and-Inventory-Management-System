const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const companyProductReturn = require('../controllers/companyProductReturn');

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/company-product-return
// @desc show all company-product-return with complete requirements
// @access private
router.get('/', protect, companyProductReturn.index);

//* @route POST /api/company-product-return
// @desc create company Product Return
// @access private
router.post('/', protect, companyProductReturn.createCompanyProductReturn);

//* @route get /api/company-product-return/statement-by-name
// @desc specific company product return statement details
// @access Private
router.get('/statement-by-name', protect, companyProductReturn.companyProductReturnStatement);

//* @route get /api/company-product-return/product-exchange-report
// @desc specific company product return statement details
// @access Private
router.get('/product-exchange-report', protect, companyProductReturn.productExchangeReport);

//* @route POST /api/company-product-return/:id/payment
// @desc add payment
// @access Private
router.post('/:id/payment', protect, companyProductReturn.addPayment);

//* @route GET /api/company-product-return/:id
// @desc fetch specific company-product-return
// @access Private
router.get('/:id', protect, companyProductReturn.searchById);

module.exports = router;