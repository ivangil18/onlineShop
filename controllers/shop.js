const products = [];

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.productsData = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/products-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products-list'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findProduct(prodId, product => {
    res.render('shop/product-details', {
      product: product,
      path: '/products-list',
      pageTitle: 'Details'
    });
  });
};

exports.getLanding = (req, res, next) => {
  res.redirect('/index');
};

exports.getCart = (req, res, next) => {
  Cart.fetchCart(cart => {
    console.log(cart);    
    res.render('shop/cart', { pageTitle: 'Cart', path: '/cart', cart: cart });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findProduct(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/');
};

exports.postCartRemove = (req, res, next) => {
  const prodId = req.body.productId;
  Cart.deleteProduct(prodId, 10.99, false);
  res.redirect('/cart');
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/index'
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { pageTitle: 'Your Orders', path: '/orders' });
};
