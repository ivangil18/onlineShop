const express = require('express');

const User = require('../models/user');

const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
  '/login',
  [
    check('email', 'email or password no valid!').isEmail(),
    check('password', 'email or password no valid!')
      .isLength({ min: 8 })
      .isAlphanumeric()
  ],
  authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signin', authController.getSignin);

router.post(
  '/signin',
  [
    check('email')
      .isEmail()
      .withMessage('Please, enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'There is already an account with that email'
            );
          }
        });
      }),
    body(
      'password',
      'Please, enter a password with only letters and numbers and with at least 8 caracteres'
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password do not match!');
      }
      return true;
    })
  ],
  authController.postSignin
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset-password/:token', authController.getResetPassword);

router.post('/reset-password', authController.postResetPassword);

module.exports = router;
