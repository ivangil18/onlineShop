const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop')

router.get('/', shopController.productsData);

router.get('/checkout', shopController.getCheckout);

router.get('/cart', shopController.getCart);

module.exports = router;
