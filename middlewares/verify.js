const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = app => {
  app.use(async (req, res, next) => {
    const token =
      req.body.token || req.param.token || req.headers['x-access-token'];

    if (token)
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          next(new Error({ message: 'Failed to authenticate token.' }));
        } else {
          req.decoded = decoded;
          next();
        }
      });
    else next(new Error({ message: 'No token provided.' }));
  });
};
