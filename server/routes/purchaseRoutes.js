// const express = require('express');
// const { protect, admin } = require('../middleware/authMiddleware');
// const purchases = require('../controllers/purchase');

// const router = express.Router();

// //! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

// //* @route GET /api/purchase
// // @desc show all purchase with complete requirements
// // @access private
// router.get('/', protect, purchases.index);

// //* @route POST /api/purchase
// // @desc create purchases
// // @access private
// router.post('/', protect, purchases.createPurchase);

// //* @route POST /api/purchase/:id/payment
// // @desc search sales between dates
// // @access Private
// router.post('/:id/payment', protect, purchases.addPayment);

// //* @route POST /api/purchase/:id/paymentforadvance
// // @desc search sales between dates
// // @access Private
// router.post('/:id/paymentforadvance', protect, purchases.paymentForAdvance);

// //* @route GET /api/purchase/:id
// // @desc fetch specific sale
// // @access Private
// router.get('/:id', protect, purchases.searchById);

// router.post('/supplier-payment', protect, purchases.supplierDuePayment);

// module.exports = router;

const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const purchases = require('../controllers/purchase'); // <--- এখানে নাম 'purchases'

const router = express.Router();

//! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

//* @route GET /api/purchase/supplier-due-list
// @desc Get supplier overall balance list
// @access Private
// 💡 ফিক্স ১: স্ট্যাটিক রাউটটি সবার উপরে আনা হলো যাতে CastError না হয়।
// 💡 ফিক্স ২: 'purchaseController' পরিবর্তন করে সঠিক ভেরিয়েবল 'purchases' ব্যবহার করা হলো।
router.get("/supplier-due-list", protect, purchases.getSupplierDueList);

router.post('/supplier-payment', protect, purchases.supplierDuePayment);


//* @route GET /api/purchase
// @desc show all purchase with complete requirements
// @access private
router.get('/', protect, purchases.index);

//* @route POST /api/purchase
// @desc create purchases
// @access private
router.post('/', protect, purchases.createPurchase);

//* @route POST /api/purchase/:id/payment
// @desc search sales between dates
// @access Private
router.post('/:id/payment', protect, purchases.addPayment);

//* @route POST /api/purchase/:id/paymentforadvance
// @desc search sales between dates
// @access Private
router.post('/:id/paymentforadvance', protect, purchases.paymentForAdvance);

//* @route GET /api/purchase/:id
// @desc fetch specific sale
// @access Private
router.get('/:id', protect, purchases.searchById);


module.exports = router;