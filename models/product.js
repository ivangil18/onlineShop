const path = require('path');
const fs = require('fs');

const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  update(id) {
    this.id = id;
    getProductsFromFile(products => {
      const productIndex = products.findIndex(prod => (prod.id = id));
      products[productIndex] = this;
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findProduct(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
