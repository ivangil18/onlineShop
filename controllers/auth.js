const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  console.log(req.session);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5c0bf503cb05021c58efb9b9')
    .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      // req.session.save(err => {
      //   console.log(err);
      //   res.redirect('/');
      // });
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
