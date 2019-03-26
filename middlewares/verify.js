const jwt = require('jsonwebtoken');

const config = require('../config.json');
const Error = require('../utils/errors');

module.exports = app => {
  app.use(async (req, res, next) => {
    const token =
      req.body.token || req.param.token || req.headers['x-access-token'];

    if (token)
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          next(
            new Error.AuthenticationError({
              message: 'Failed to authenticate token.'
            })
          );
        } else {
          req.decoded = decoded;
          next();
        }
      });
    else next(new Error.AuthenticationError({ message: 'No token provided.' }));
  });
};
