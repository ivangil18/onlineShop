const express = require('express');

const router = express.Router();

const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');

router.get('/', productsController.productsData);

router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);
router.get('/index', shopController.getIndex);

module.exports = router;
