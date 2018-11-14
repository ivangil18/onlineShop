exports.error404 = (req, res, next) => {
  res
    .status(404)
    .render('404-error', { pageTitle: '404 Error', path: '/404-error' });
};
