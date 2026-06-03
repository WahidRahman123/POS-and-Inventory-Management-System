// const express = require('express');
// const { protect, admin } = require('../middleware/authMiddleware');
// const ProductExchange = require('../controllers/productExchange');

// const router = express.Router();

// //! protect ta add korte hobe, ekhane kothao admin add korar proyojon nei

// //* @route GET /api/product-exchange
// // @desc show all exchange with complete requirements
// // @access private
// // router.get('/', protect, ProductExchange.index);

// //* @route GET /api/product-exchange/memo
// // @desc fetch specific exchange
// // @access Private
// router.get('/search/memo', protect, ProductExchange.searchByMemo);

// //* @route POST /api/product-exchange
// // @desc create exchanges
// // @access private
// router.post('/', protect, ProductExchange.createProductExchange);



// module.exports = router;


const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const ProductExchange = require('../controllers/productExchange');

const router = express.Router();


router.get('/search/memo', protect, ProductExchange.searchByMemo);


router.get('/', protect, ProductExchange.index);
router.post('/', protect, ProductExchange.createProductExchange);

//* @route get /api/product-exchange/search-by-product-name
// @desc sales product exchange stock searched by product name
// @access Private
router.get('/search-by-product-name', protect, ProductExchange.productExchangeStockSearchedByProductName);

module.exports = router;