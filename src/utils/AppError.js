class AppError {
  statusCode;
  message;

  constructor(statusCode = 400, message) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
