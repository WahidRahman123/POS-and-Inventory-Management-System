const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');
const products = require('../controllers/products');

const router = express.Router();

//* @route GET /api/products
// @desc show all products with limit
// @access private
router.get('/', protect, products.index);

//* @route POST /api/products
// @desc Create new products
// @access private
router.post('/', protect, products.createProduct);

//* @route GET /api/products/search
// @desc search products
// @access private
router.get('/search', protect, products.searchProduct);

//* @route GET /api/products/searchforpos
// @desc search products for POS System
// @access private
router.get('/searchforpos', protect, products.searchProductForPOS);

//? Product Quantity Related
//* @route GET /api/products/product-low-quantity-check
// @desc search products
// @access private
router.get('/product-low-quantity-check', protect, products.productLowQuantityCheck);

// @route GET /api/products/low-quantity-product-list
// @desc search products
// @access private
router.get('/low-quantity-product-list', protect, products.lowQuantityProductList);

//* @route GET /api/products/addstock/:id
// @desc search products
// @access private
router.post('/addstock/:id', protect, products.addStock);

//* @route GET /api/products/quantity/:id
// @desc fetch only product's quantity
// @access private
router.get('/quantity/:id', protect, products.quantityOfProduct);

//* @route GET /api/products/:id
// @desc show specific product
// @access private
router.get('/:id', protect, products.showProduct);

//* @route PUT /api/products/:id
// @desc Update specific product
// @access private
router.put('/:id', protect, products.updateProduct);

//* @route DELETE /api/products/:id
// @desc Delete specific product
// @access private
router.delete('/:id', protect, products.deleteProduct);





module.exports = router;