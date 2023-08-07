const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const cartsRouter = require('./routes/carts');
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port${PORT}`);
});

