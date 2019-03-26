// Refer: https://medium.com/learn-with-talkrise/custom-errors-with-node-express-27b91fe2d947

class ApplicationError extends Error {
  constructor({ message, data }) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.data = data;
    this.message =
      message ||
      'Something went wrong in our backyard. Contact the lazy admin.';
    this.status = 500;
  }
}

class BadRequestError extends Error {
  constructor({ message, data }) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.data = data;
    this.message = message || 'Please check your query and try again.';
    this.status = 400;
  }
}

class AuthenticationError extends Error {
  constructor({ message, data }) {
    super();

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;

    this.message = message || 'You are not permitted to access this data.';
    this.data = data;
    this.status = 403;
  }
}

module.exports = { ApplicationError, BadRequestError, AuthenticationError };
