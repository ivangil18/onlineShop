const products = [];

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
    addProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.productsData = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      activeShop: true
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Edit Product' });
};

exports.getProducts = (req, res, next) => {
  res.render('admin/products', { pageTitle: 'Products' });
};
