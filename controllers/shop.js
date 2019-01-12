const Product = require('../models/product');
const Order = require('../models/order');

const fs = require('fs');
const path = require('path');
const PDFdocument = require('pdfkit');

exports.productsData = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/products-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products-list',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-details', {
        product: product,
        path: '/products-list',
        pageTitle: 'Details',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getLanding = (req, res, next) => {
  res.redirect('/index');
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(userCart => {
      const products = userCart.cart.items;
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cart: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postRemoveProductFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      console.log('Product Removed from Cart!');
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/index'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(userCart => {
      const products = userCart.cart.items.map(i => {
        return { product: { ...i.productId._doc }, quantity: i.quantity };
      });
      const order = new Order({
        products: products,
        user: {
          email: req.user.email,
          userId: req.user
        }
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('Order not found'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFdocument();
      res.setHeader('Content-type', 'application/pdf');
      res.setHeader(
        'Content-disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(18).text('Invoice');

      pdfDoc
        .fontSize(12)
        .text(
          '_________________________________________________________________'
        );

      let totalAmount = 0;
      order.products.forEach(prod => {
        pdfDoc.text('     ');
        pdfDoc.fontSize(12).text(prod.product.title);
        pdfDoc.text('Price: $' + prod.product.price)
        pdfDoc.text('Amount: ' + prod.quantity);
        const totalPrice = prod.quantity * prod.product.price;
        totalAmount += totalPrice;
        pdfDoc.text('Total Price: $' + totalPrice);
        pdfDoc.text(
          '......................................................................'
        );
      });
      pdfDoc.text('_________________________________________________________________');
      pdfDoc.fontSize(8).text('  ');
      pdfDoc.fontSize(16).text('Total Amount: $' + totalAmount);

      pdfDoc.end();
    })
    //   fs.readFile(invoicePath, (err, data) => {
    //     if (err) {
    //       return next(err);
    //     }
    //     res.setHeader('Content-type', 'application/pdf');
    //     res.setHeader(
    //       'Content-disposition',
    //       'attachment; filename="' + invoiceName + '"'
    //     );
    //     res.send(data);
    //   });

    .catch(err => next(err));
};
