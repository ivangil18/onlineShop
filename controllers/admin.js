const Product = require('../models/product');

const mongoose = require('mongoose');

const fileHelper = require('../util/file');

const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
    editMode: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: [],
    hasError: false,
    validationResult: [],
    oldInput: {
      title: '',
      price: '',
      description: '',
      imageURL: ''
    }
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.file;
  const userId = req.user;

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/add-product',
      editMode: false,
      isAuthenticated: req.session.isLoggedIn,
      editMode: false,
      hasError: true,
      errorMessage: 'Attached file is not an image!',
      validationResult: [],
      product: {
        title: title,
        price: price,
        description: description
      }
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/add-product',
      editMode: false,
      isAuthenticated: req.session.isLoggedIn,
      editMode: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationResult: errors.array(),
      product: {
        title: title,
        price: price,
        description: description
      }
    });
  }

  const imageURL = image.path;

  const product = new Product({
    // _id,
    title,
    price,
    description,
    imageURL,
    userId
  });
  product
    .save()
    .then(result => {
      console.log('Product Added');
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editProduct = req.query.edit;
  if (!editProduct) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('admin/edit-product', {
        product: product,
        pageTitle: 'Edit Product',
        path: '/edit-product',
        editMode: editProduct,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: [],
        validationResult: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const image = req.file;
  const idProd = req.body.productId;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
        _id: idProd
      },
      pageTitle: 'Edit Product',
      path: '/edit-product',
      editMode: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationResult: errors.array()
    });
  }

  Product.findById(idProd)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        fileHelper.deleteFile(product.imageURL);
        product.imageURL = image.path;
      }
      return product.save();
    })
    .then(result => {
      console.log('Product Updated!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: req.flash('error')
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found!'));
      }
      fileHelper.deleteFile(product.imageURL);
      return Product.findByIdAndDelete(prodId);
    })
    .then(result => {
      console.log('Product Deleted');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
