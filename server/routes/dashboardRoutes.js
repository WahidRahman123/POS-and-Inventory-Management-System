const express = require('express');
const protect = require('../middleware/authMiddleware');
const dashboards =require('../controllers/dashboard');

const router = express.Router();

//! Add protect to all

//* @route GET /api/dashboard
// @desc show dashboard aggregated results
// @access private
router.get('/', dashboards.index);


module.exports = router;