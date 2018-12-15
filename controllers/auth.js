const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        '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'
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

          })
        });
    })
    .catch(err => console.log(err));
};

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset-password', {
    path: '/reset-password',
    pageTitle: 'Reset Password',
    errorMessage: req.flash('loginError')
  });
};
