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
  const price = req.body.price;
  const description = req.body.description;
  const imageURL = req.body.imageURL;
  const userId = req.user;

  const product = new Product({
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
    .catch(err => console.log(err));
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
        editMode: editProduct
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const updatedtitle = req.body.title;
  const updatedprice = req.body.price;
  const updateddescription = req.body.description;
  const updatedimageURL = req.body.imageURL;
  const idProd = req.body.productId;

  Product.findById(idProd)
    .then(product => {
      product.title = updatedtitle;
      product.price = updatedprice;
      product.description = updateddescription;
      product.imageURL = updatedimageURL;
      return product.save();
    })
    .then(result => {
      console.log('Product Updated!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then(result => {
      console.log('Product Deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
