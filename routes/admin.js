const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middlewares/is-auth');

const { check } = require('express-validator/check');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
  '/add-product',
  [
    check('title')
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage('Please, enter a valid title'),
    check('price')
      .isFloat()
      .trim()
      .withMessage('Please, enter a valid value for the price'),
    check('description')
      .isLength({ min: 5, max: 200 })
      .withMessage('Please enter a description for your product')
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    check('title')
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage('Please, enter a valid title'),
    check('price')
      .isFloat()
      .trim()
      .withMessage('Please, enter a valid value for the price'),
    check('description')
      .isLength({ min: 5, max: 200 })
      .withMessage('Please enter a description for your product')
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.getDeleteProduct);

module.exports = router;
