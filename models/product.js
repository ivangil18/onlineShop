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
  constructor(id, title, imageURL, description, price) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        console.log('entra aqui');
        const productIndex = products.findIndex(prod => (prod.id = this.id)); //probar aqui poner ===
        const updatedProducts = [...products];
        updatedProducts[productIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {});
      } else {
        console.log('aqui no entra');
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
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
