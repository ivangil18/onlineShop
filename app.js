const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csfr = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errors = require('./controllers/errors');

const User = require('./models/user');

const app = express();

const MONGODB_URI =
  'mongodb+srv://igil:d5xqpHR4uvTFqTzg@cluster0-l40tt.mongodb.net/test?retryWrites=true';

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csfrProtection = csfr();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'my_secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(flash());

app.use(csfrProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errors.error500);
app.use(errors.error404);

app.use((error, req, res, next) => {
  res.redirect('/500');
});

mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(result => {
    console.log('connected!');
    app.listen(3000);
  })
  .catch(err => console.log(err));
