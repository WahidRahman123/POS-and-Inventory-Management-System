const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const customers = require('../controllers/customer');


const router = express.Router();

//! protect dite hobe

//* @route GET /api/customer
// @desc All customer fetch
// @access Private
router.get('/', protect, customers.index);

//* @route GET /api/customer/pos
// @desc All customer fetch for pos
// @access Private
router.get('/pos', protect, customers.customersForPOS);

//* @route POST /api/customer
// @desc Create Customer
// @access Private
router.post('/', protect, customers.createCustomer);

//* @route PUT /api/customer/:id
// @desc update customer
// @access Private
router.put('/:id', protect, customers.updateCustomer);

//* @route Delete /api/customer/:id
// @desc delete customer
// @access Private
router.delete('/:id', protect, customers.deleteCustomer);

module.exports = router;