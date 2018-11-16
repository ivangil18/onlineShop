const products = [];

const Product = require('../models/product');

exports.productsData = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/products-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      activeShop: true
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', { pageTitle: 'Cart', path: '/cart' });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
};

exports.getIndex = (req, res, next) =>{
  res.render('shop/index', {pageTitle: 'Home', path: '/index'})
}

exports.getOrders = (req, res, next)=>{
res.render('shop/orders', {pageTitle: 'Your Orders', path: '/orders'})
}

