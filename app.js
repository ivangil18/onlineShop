const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errors = require('./controllers/errors');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5c0bf503cb05021c58efb9b9')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errors.error404);

mongoose
  .connect(
    'mongodb+srv://igil:UJXhzOMotdIUTtHX@cluster0-l40tt.mongodb.net/shop?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Cuco',
          email: 'cuco@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    console.log('connected!');
    app.listen(3000);

  })
  .catch(err => console.log(err));
