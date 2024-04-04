module.exports = (err, req, res, next) => {
  console.log(err.stack); // shows us where the error happened
  // For errors not created by us but somewhere else like the node app for eg
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
