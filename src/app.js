const express = require('express');
const handlebars = require("express-handlebars")
const __dirname = require("utils.js")

const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname+"/public"))

const PORT = 8080;

const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

const cartsRouter = require('./routes/carts');
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port${PORT}`);
});