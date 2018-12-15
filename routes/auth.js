const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signin', authController.getSignin);

router.post('/signin', authController.postSignin);

router.get('/reset-password', authController.getResetPassword);

module.exports = router;
