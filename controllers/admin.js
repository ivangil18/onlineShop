const products = [];

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
    editMode: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imgURL = req.body.imageURL;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(null, title, imgURL, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editProduct = req.query.edit;
  if (!editProduct) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findProduct(prodId, product => {
    res.render('admin/edit-product', {
      product: product,
      pageTitle: 'Edit Product',
      path: '/edit-product',
      editMode: editProduct
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imgURL = req.body.imageURL;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(id, title, imgURL, description, price);
  product.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/products'
    });
  });
};
