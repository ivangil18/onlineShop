const express = require('express');

const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signin', authController.getSignin);

router.post(
  '/signin',
  [
    check('email')
      .isEmail()
      .withMessage('Please, enter a valid email'),
    body(
      'password',
      'Please, enter a password with only letters and numbers and with at least 8 caracteres'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
  ],
  authController.postSignin
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset-password/:token', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

module.exports = router;
