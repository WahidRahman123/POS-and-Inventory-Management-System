const express = require('express');
const Sales = require('../models/Sales');
const { protect, admin } = require('../middleware/authMiddleware');
const sales = require('../controllers/sales');

const router = express.Router();

//* @route GET /api/sales
// @desc All Sales fetch
// @access Private
router.get('/', protect, admin, sales.index);

//* @route POST /api/sales
// @desc Create sales
// @access Private
router.post('/',  protect, sales.createSales);

//* @route GET /api/sales/getTotalSaleCount
// @desc get the total sale count
// @access Private
router.get('/getTotalSaleCount', protect, sales.getTotalSaleCount);

//* @route GET /api/sales/search
// @desc search sales between dates
// @access Private
router.get('/search', protect, sales.searchByDates);

//* @route GET /api/sales/searchIndividual
// @desc search sales between dates
// @access Private
router.get('/searchIndividual', protect, sales.searchByIndividualDate);

//* @route get /api/sales/by-name
// @desc specific supplier purchase return details
// @access Private
router.get('/by-name', protect, sales.salesByCustomerName);

//* @route get /api/sales/due-list
// @desc specific supplier purchase return details
// @access Private
router.get('/due-list', protect, sales.salesDueList);

//* @route POST /api/sales/payment
// @desc search sales between dates
// @access Private
router.post('/payment', protect, admin, sales.addPayment);

//* @route GET /api/sales/:id
// @desc fetch specific sale
// @access Private
router.get('/:id', protect, admin, sales.searchById);


module.exports = router;