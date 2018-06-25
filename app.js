const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const config = require('./config/config');

const app = express();

// Middlewares
const authMiddleware = require('./middlewares/authMiddleware');

// Controllers
const authController = require('./controllers/authController');
const accountController = require('./controllers/accountController');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/api/auth', authController);


app.use(authMiddleware.verifyToken);

// Authorized API
app.use('/api/account', accountController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  // only providing error in development
  let error = "Something went wrong";
  if (config.server.isDevelopment) {
    error = err.message;
  }
  if (err.status && config.server.isProduction) {
    error = err.message;
  }
  res.status(err.status || 500);
  res.send({ "error": error });
});

module.exports = app;
