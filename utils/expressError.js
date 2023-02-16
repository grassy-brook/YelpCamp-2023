class ExpressError extends Error {
  constructor(messaage, statusCode) {
    super();
    this.message = messaage;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;