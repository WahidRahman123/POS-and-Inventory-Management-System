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


module.exports = router;