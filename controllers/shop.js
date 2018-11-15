exports.getCart = (req, res, next) => {
    res.render('shop/cart', { pageTitle: 'Cart', path: '/cart' });
  };
  
  exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout.ejs', { pageTitle: 'Checkout', path: '/checkout' });
  };
  
  exports.getIndex = (req, res, next) =>{
    res.render('shop/index', {pageTitle: 'Home', path: '/index'})
  }