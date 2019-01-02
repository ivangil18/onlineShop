exports.error404 = (req, res, next) => {
  res.status(404).render('404-error', {
    pageTitle: '404 Error',
    path: '/404-error',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.error500 = (req, res, next) => {
  res
    .status(500)
    .render('500-error', {
      pageTitle: 'Error!',
      path: '/500',
      isAuthenticated: req.session.isLoggedIn
    });
};
