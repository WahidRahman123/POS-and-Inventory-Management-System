const express = require('express');
const Product = require('../models/Product');
const protect = require('../middleware/authMiddleware');
const products = require('../controllers/products');

const router = express.Router();

//! Add protect to all

//* @route GET /api/products
// @desc show all products with limit
// @access private
router.get('/', products.index);

//* @route POST /api/products
// @desc Create new products
// @access private
router.post('/', products.createProduct);

//* @route GET /api/products/search
// @desc search products
// @access private
router.get('/search', products.searchProduct);

//* @route GET /api/products/searchforpos
// @desc search products for POS System
// @access private
router.get('/searchforpos', products.searchProductForPOS);

//? Product Quantity Related
//* @route GET /api/products/product-low-quantity-check
// @desc search products
// @access private
router.get('/product-low-quantity-check', products.productLowQuantityCheck);

// @route GET /api/products/low-quantity-product-list
// @desc search products
// @access private
router.get('/low-quantity-product-list', products.lowQuantityProductList);

//* @route GET /api/products/addstock/:id
// @desc search products
// @access private
router.post('/addstock/:id', products.addStock);

//* @route GET /api/products/quantity/:id
// @desc fetch only product's quantity
// @access private
router.get('/quantity/:id', products.quantityOfProduct);

//* @route GET /api/products/:id
// @desc show specific product
// @access private
router.get('/:id', products.showProduct);

//* @route PUT /api/products/:id
// @desc Update specific product
// @access private
router.put('/:id', products.updateProduct);

//* @route DELETE /api/products/:id
// @desc Delete specific product
// @access private
router.delete('/:id', products.deleteProduct);





module.exports = router;