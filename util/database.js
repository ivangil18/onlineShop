const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://igil:UJXhzOMotdIUTtHX@cluster0-l40tt.mongodb.net/shop?retryWrites=true',
    { useNewUrlParser: true }
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'Error: Database not Found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
