// Create new class andm where all of our app error objects to inherit from the built-in error
class AppError extends Error {
  constructor(message, statusCode) {
    // we pass in message, because it's the only built-in parameter Error accepts
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    /* All operational errors will be set to true, 
    we can test for this property and only send error msgs back to client that we created using this class
    Useful, because other unexpected error sthat might happen (bugs etc), will then not have the isOperational property */
    this.isOperational = true;

    // When a new obj is created  & constructor is called, this will not appear in the stack trace and pollute it
    // Pass in current obj & app error class
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
