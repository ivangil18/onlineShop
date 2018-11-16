const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop')

router.get('/index', shopController.productsData);

router.get('/checkout', shopController.getCheckout);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/products-list', shopController.productsData)

module.exports = router;
