const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const dashboards =require('../controllers/dashboard');

const router = express.Router();

//* @route GET /api/dashboard
// @desc show dashboard aggregated results
// @access private
router.get('/',  dashboards.index);


module.exports = router;