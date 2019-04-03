const jwt = require('jsonwebtoken');
const router = require('express').Router();

const Error = require('../utils/errors');
const { UserRepositoryFactory } = require('../models');
const config = require('../config.json');

module.exports = knexClient => {
  const userRepository = UserRepositoryFactory(knexClient);

  router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userRepository.getUserByEmail(email);

    if (!user)
      return next(
        new Error.BadRequestError({
          message: 'Authentication failed. User not found.'
        })
      );
    else if (user) {
      if (!userRepository.matchPassword(password, user.password))
        return next(
          new Error.BadRequestError({
            message: 'Authentication failed. Wrong password.'
          })
        );
      else {
        const { id, handle, email, isAdmin } = user;
        const payload = { id, handle, email, isAdmin };

        const token = jwt.sign(payload, config.secret, {
          expiresIn: 86400 // expires in 24 hours
        });

        res.json({
          message: 'Enjoy your token!',
          user: payload,
          token
        });
      }
    }
  });

  router.post('/signup', async (req, res, next) => {
    // email validation
    if (!/(.+)@(.+){2,}\.(.+){2,}/.test(req.body.email)) {
      return next(
        new Error.BadRequestError({
          message: 'Enter a valid email.'
        })
      );
    }

    // phonenumber validation
    if (!/^[789]\d{9}/.test(req.body.phonenumber)) {
      return next(
        new Error.BadRequestError({
          message: 'Enter a valid phonenumber.'
        })
      );
    }

    // password validation
    if (!req.body.password || req.body.password.length < 6) {
      return next(
        new Error.BadRequestError({
          message: 'Only 6 to 20 character length allowed.'
        })
      );
    }

    try {
      const id = await userRepository.create(req.body);
      const user = await userRepository.getUserById(id);
      return res.json(user);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
