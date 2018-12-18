const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: 'enter yours'

    }
  })
);

exports.getLogin = (req, res, next) => {
  console.log(req.session);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: req.flash('loginError')
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('loginError', 'Email or Password no valid');
        return res.redirect('/login');
      }
      bcryptjs.compare(password, user.password).then(doMatch => {
        if (!doMatch) {
          req.flash('loginError', 'Email or Password no valid');
          return res.redirect('/login');
        } else {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignin = (req, res, next) => {
  res.render('auth/signin', {
    path: '/signin',
    pageTitle: 'Sign In',
    errorMessage: req.flash('registerError')
  });
};

exports.postSignin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('registerError', 'Email already used!');
        return res.redirect('/signin');
      }
      bcryptjs
        .hash(password, 12)
        .then(hashPassword => {
          const user = new User({
            email: email,
            password: hashPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          console.log('user registered!');
          res.redirect('/login');
          transporter.sendMail({
            to: email,
            from: 'no-reply@myonlineshop.com',
            subject: 'Signin Confirmation',
            html: '<h1>SUCCESS!</h1>'
          });
        });
    })
    .catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset-password',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('loginError'),
    errorMessage: req.flash('email-error')
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('email-error', 'Account not found for that email');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.tokenExpirationDate = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'no-reply@myonlineshop.com',
          subject: 'Password Reset',
          html: `
          <p> You have request a password change </p>
          <p> Please, <a href= "http://localhost:3000/reset-password/${token}">click here</a> to reset your password </p>
          `
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getResetPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, tokenExpirationDate: { $gt: Date.now() } })
    .then(user => {
      // if (!user) {
      //   req.flash('reset-error', 'Request no valid!');
      //   return res.redirect('/');
      // }
      res.render('auth/reset-password', {
        path: '/reset-password',
        pageTitle: 'Reset Password',
        errorMessage: req.flash('reset-error'),
        userId: user._id.toString(),
        userToken: token
        
      });
    })
    .catch(err => console.log(err));
};
exports.postResetPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const userToken = req.body.userToken;
  let resetUser;

  if (newPassword !== confirmPassword) {
    req.flash('error-resetPassword', 'Passwords do not match!');
    return res.redirect('/reset-password');
  }
  
  User.findOne({ _id: userId, userToken: userToken, tokenExpirationDate: {$gt: Date.now()}  })
    .then(user => {
      if (!user) {
        req.flash('error-resetPassword', 'User not found');
        return res.redirect('/');
      }
      resetUser = user;
      return bcryptjs.hash(newPassword, 12);
    })
    .then(hashPassword => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.tokenExpirationDate = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));
};
