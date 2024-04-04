const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// Can now visit http://127.0.0.1:3000/overview.html
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/* Since middleware is added to the stack in the order it is defined in the code,
this middleware will only run if the previous two routes are not matched */
app.all('*', (req, res, next) => {
  // We create an error and define its status and status code properties on it, so that
  // our error handling middleware can use it in the next step
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;

  /* If next receives an argument, Express will always assume there is an error
   and will skip all other middlewares in the middleware stack,
   and send the error we passed in to the global error handling middleware */
  next(err);
});

app.use((err, req, res, next) => {
  // For errors not created by us but somewhere else like the node app for eg
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
