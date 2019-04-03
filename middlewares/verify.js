const jwt = require('jsonwebtoken');

const config = require('../config.json');
const Error = require('../utils/errors');

module.exports = (req, res, next) => {
  const token =
    req.body.token || req.param.token || req.headers['x-access-token'];

  if (token)
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return next(
          new Error.AuthenticationError({
            message: 'Failed to authenticate token.'
          })
        );
      } else {
        req.decoded = decoded;
        return next();
      }
    });
  else
    return next(
      new Error.AuthenticationError({ message: 'No token provided.' })
    );
};
