const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/is-auth');

router.get('/', shopController.getLanding);

router.get('/index', shopController.getIndex);

// router.get('/checkout', shopController.getCheckout);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart-remove', isAuth, shopController.postRemoveProductFromCart);

router.post('/cart', isAuth, shopController.postCart);

router.get('/add-order', isAuth, shopController.getAddOrder);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/products-list', shopController.productsData);

router.get('/product/:productId', shopController.getProduct);

router.get('/invoice/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
