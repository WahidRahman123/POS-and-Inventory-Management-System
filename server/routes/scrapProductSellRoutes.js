const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const companyProductReturn = require('../controllers/companyProductReturn');
const scrapProductSell = require('../controllers/scrapProductSell');

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/scrap-product-sell
// @desc show all company-product-return with complete requirements
// @access private
router.get('/', protect, scrapProductSell.index);

//* @route POST /api/scrap-product-sell
// @desc create company Product Return
// @access private
router.post('/', protect, scrapProductSell.createScrapProductSell);

//* @route get /api/scrap-product-sell/statement-by-name
// @desc specific company product return statement details
// @access Private
router.get('/statement-by-name', protect, scrapProductSell.scrapProductSellStatement);

//* @route POST /api/scrap-product-sell/:id/payment
// @desc add payment
// @access Private
router.post('/:id/payment', protect, scrapProductSell.addPayment);

//* @route GET /api/scrap-product-sell/:id
// @desc fetch specific company-product-return
// @access Private
router.get('/:id', protect, scrapProductSell.searchById);

module.exports = router;