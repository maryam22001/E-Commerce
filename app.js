const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
require('dotenv').config(); //from optiontions I can pase the path of the .env file if it is not in the root directory
const productsRoute = require('./routes/products.js');

/**app.use((req, res, next) => {
console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
  next()});
**/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static('assets'));

app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Welcome to the E-Commerce API' });
});
app.use('/products', productsRoute);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'err.html'));
});

module.exports = app;