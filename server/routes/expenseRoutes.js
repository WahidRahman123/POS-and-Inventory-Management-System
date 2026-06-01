const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
  index,
  createMultipleExpenses,
  getTotalExpense
} = require('../controllers/expense');   // ← এভাবে ইম্পোর্ট করতে হবে

const router = express.Router();

router.get('/', protect, index);
router.post('/multiple', protect, createMultipleExpenses);
router.get('/total', protect, getTotalExpense);

module.exports = router;