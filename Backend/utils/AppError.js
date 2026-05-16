class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.isOperational = true;//in case the error is the input data is wrong,I dont need to stop the server 

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;