const express = require('express');
const fs = require('fs');
const path = require('path');

const productsRouter = express.Router();

const productsFilePath = path.join(__dirname, '../data/products.json');

function readProductsFile() {
  const productsData = fs.readFileSync(productsFilePath, 'utf8');
  return JSON.parse(productsData);
}

function writeProductsFile(data) {
  fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
}

productsRouter.get('/', (req, res) => {
  const { limit } = req.query;
  let products = readProductsFile();
  
  if (limit) {
    products = products.slice(0, limit);
  }

  res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readProductsFile();
  const product = products.find((p) => p.id.toString() === pid.toString());

  if (!product) {
    return res.status(404).json({ error: 'Product Not Found' });
  }

  res.json(product);
});

productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  const products = readProductsFile();

  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  newProduct.id = Date.now().toString();
  newProduct.status = true; 
  products.push(newProduct);

  writeProductsFile(products);

  res.json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  const products = readProductsFile();
  const index = products.findIndex((p) => p.id.toString() === pid.toString());

  if (index === -1) {
    return res.status(404).json({ error: 'Product Not Found' });
  }

  if (!updatedProduct.hasOwnProperty('status')) {
    updatedProduct.status = true;
  }

  updatedProduct.id = pid;
  products[index] = updatedProduct;

  writeProductsFile(products);

  res.json(updatedProduct);
});


productsRouter.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readProductsFile();
  const index = products.findIndex((p) => p.id === pid);

  if (index === -1) {
    return res.status(404).json({ error: 'Product Not Found' });
  }

  products.splice(index, 1);

  writeProductsFile(products);

  res.json({ message: 'Product deleted successfully' });
});

module.exports = productsRouter;
