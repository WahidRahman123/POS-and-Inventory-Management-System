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
router.post('/', protect, sales.createSales);

//* @route GET /api/sales/search
// @desc search sales between dates
// @access Private
router.get('/search', protect, admin, sales.searchByDates);

//* @route GET /api/sales/searchIndividual
// @desc search sales between dates
// @access Private
router.get('/searchIndividual', protect, admin, sales.searchByIndividualDate);

//* @route GET /api/sales/:id/payment
// @desc search sales between dates
// @access Private
router.post('/:id/payment', protect, admin, sales.addPayment);

//* @route GET /api/sales/:id
// @desc fetch specific sale
// @access Private
router.get('/:id', protect, admin, sales.searchById);


module.exports = router;