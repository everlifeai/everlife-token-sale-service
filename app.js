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

// Authorized API
app.use(authMiddleware.verifyToken);
app.use('/api/account', accountController);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

/*      problem/
 * Whenever there is a problem we need the user to know that something
 * has gone wrong.  The developer, during coding, should be able to see
 * all types of errors which would not make sense to the end users.
 *
 *      way/
 * In the development environment, we show all errors. Otherwise we
 * generally show a simple "something went wrong" message to the user.
 * If we have a more specific message to show we signal that by setting
 * the error status and message - in that case we carry the message back
 * to the user as well.
 */
app.use(function (err, req, res, next) {
  console.log(err);
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
