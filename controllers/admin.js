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

  const product = new Product(title, price, description, imageURL);
  product
    .save()
    .then(result => {
      console.log(result);
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
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageURL = req.body.imageURL;
  const idProd = req.body.productId;

  const product = new Product(title, price, description, imageURL, idProd);

  product
    .save()
    .then(() => {
      console.log('Updated Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.deleteProduct(prodId)
    .then(result => {
      console.log('Product Deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
