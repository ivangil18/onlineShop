const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csfr = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errors = require('./controllers/errors');

const User = require('./models/user');

const app = express();

const MONGODB_URI =
  'mongodb+srv://igil:8mktvyjzS7SKf7PD@cluster0-l40tt.mongodb.net/store?retryWrites=true';

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csfrProtection = csfr();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getMilliseconds().toString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

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
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//app.get('/400', errors.error404);
app.use(errors.error404);

app.use((error, req, res, next) => {
  //res.redirect('/500');
  res.status(500).render('500-error', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
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
