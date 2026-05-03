const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');
require('dotenv').config(); //from optiontions I can pase the path of the .env file if it is not in the root directory
const productsRoute = require('./routes/products.js');
const globalError = require('./middlewares/globalError.js');
const cookieParser = require('cookie-parser'); // npm install cookie-parser
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/user.js');
const { protect, restrictTo } = require('./middlewares/auth.js');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
/**app.use((req, res, next) => {
console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
  next()});
**/
app.use(express.json());
app.use(morgan("dev"));

// Security & CORS middlewares
app.use(cors()); //>?? port
app.use(helmet());
app.use(mongoSanitize());

// Rate limiting: Limit each IP to 100 requests per window (here, 1 hour)
const limiter = rateLimit({
  max: 100, 
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use(limiter);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets'));

app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/users', protect, usersRoute);

app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Welcome to the E-Commerce API' });
});
app.use('/products', productsRoute);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'err.html'));
});
app.use(globalError)

module.exports = app;