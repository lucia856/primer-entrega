const express = require('express');
const fs = require('fs');
const path = require('path');

const cartsRouter = express.Router();

const cartsFilePath = path.join(__dirname, '../data/carts.json');

function readCartsFile() {
  const cartsData = fs.readFileSync(cartsFilePath, 'utf8');
  return JSON.parse(cartsData);
}

function writeCartsFile(data) {
  fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));
}

cartsRouter.post('/', (req, res) => {
  const newCart = {
    id: Date.now().toString(),
    products: [],
  };

  const carts = readCartsFile();
  carts.push(newCart);

  writeCartsFile(carts);

  res.json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carts = readCartsFile();
  const cart = carts.find((c) => c.id === cid);

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  res.json(cart.products);
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity) || 1;
  const carts = readCartsFile();
  const cartIndex = carts.findIndex((c) => c.id === cid);

  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const products = carts[cartIndex].products;
  const productIndex = products.findIndex((p) => p.product === pid);

  if (productIndex === -1) {
    products.push({ product: pid, quantity: 1 });
  } else {
    products[productIndex].quantity += quantity;
  }

  writeCartsFile(carts);

  res.json({ message: 'Product added to the cart successfully'});
});

module.exports = cartsRouter;
