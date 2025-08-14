const express = require('express');
const Sales = require('../models/Sales');
const protect = require('../middleware/authMiddleware');
const sales = require('../controllers/sales');


const router = express.Router();

//! Add protect to all

//* @route GET /api/sales
// @desc All Sales fetch
// @access Private
router.get('/', sales.index);

//* @route POST /api/sales
// @desc Create sales
// @access Private
router.post('/', sales.createSales);

//* @route GET /api/sales/search
// @desc search sales between dates
// @access Private
router.get('/search', sales.searchByDates);


module.exports = router;