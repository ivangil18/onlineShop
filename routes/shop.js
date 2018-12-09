const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop')

router.get('/', shopController.getLanding);

router.get('/index', shopController.getIndex);

// router.get('/checkout', shopController.getCheckout);

router.get('/cart', shopController.getCart);

// router.post('/cart-remove', shopController.postRemoveProductFromCart)

router.post('/cart', shopController.postCart);

// router.get('/add-order', shopController.getAddOrder);

// router.get('/orders', shopController.getOrders);

router.get('/products-list', shopController.productsData)

router.get('/product/:productId', shopController.getProduct)



module.exports = router;
