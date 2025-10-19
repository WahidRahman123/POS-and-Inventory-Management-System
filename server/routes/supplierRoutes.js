const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const suppliers = require('../controllers/suppliers');


const router = express.Router();

//! protect dite hobe

//* @route GET /api/supplier
// @desc All supplier fetch
// @access Private
router.get('/', protect, suppliers.index);

//* @route GET /api/supplier/purchase
// @desc All supplier fetch for pos
// @access Private
router.get('/purchase', protect, suppliers.supplierForPurchase);

//* @route POST /api/supplier
// @desc Create Customer
// @access Private
router.post('/', protect, suppliers.createSupplier);

//* @route get /api/supplier/purchaseByName
// @desc specific supplier purchase details
// @access Private
router.get('/purchaseByName', protect, suppliers.purchaseBySupplierName);

//* @route PUT /api/customer/:id
// @desc update customer
// @access Private
router.put('/:id', protect, suppliers.updateSupplier);

//* @route Delete /api/customer/:id
// @desc delete customer
// @access Private
router.delete('/:id', protect, suppliers.deleteSupplier);

module.exports = router;