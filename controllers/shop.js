const products = [];

const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.productsData = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products-list'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-details', {
        product: product,
        path: '/products-list',
        pageTitle: 'Details'
      });
    })
    .catch(err => console.log(err));
};

exports.getLanding = (req, res, next) => {
  res.redirect('/index');
};

exports.getCart = (req, res, next) => {
  req.user
    .fetchCart()
    .then(products => {
      console.log('entra aqui pero nada');
      console.log(products);
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cart: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log('Product Added!');
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postRemoveProductFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      console.log('Product Remove from Cart');
      res.redirect('/cart');      
    })
    .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/index'
      });
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', { pageTitle: 'Your Orders', path: '/orders' });
};
