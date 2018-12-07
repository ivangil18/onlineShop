const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errors = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findUserById('5c0446d4b184610d64592127')
    .then(user => {
      console.log('este es el user de aqui');      
      console.log(user);
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errors.error404);

mongoConnect(() => {
  app.listen(3000);
});
