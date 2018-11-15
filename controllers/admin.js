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
  const title = req.body.title;
  const imgURL = req.body.imageURL;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(title, imgURL, description,price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  res.render('admin/edit-product', { pageTitle: 'Edit Product' });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/products',
      activeShop: true
    });
  });
};
