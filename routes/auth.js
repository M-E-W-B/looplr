const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const router = require('express').Router();

const Error = require('../utils/errors');
const config = require('../config.json');

module.exports = ({ userRepository }) => {
  router.post('/login', async (req, res, next) => {
    const fields = pick(req.body, ['email', 'password']);
    const user = await userRepository.getUserByEmail(fields.email);

    if (!user)
      return next(
        new Error.BadRequestError({
          message: 'Authentication failed. User not found.'
        })
      );
    else if (user) {
      if (!userRepository.matchPassword(fields.password, user.password))
        return next(
          new Error.BadRequestError({
            message: 'Authentication failed. Wrong password.'
          })
        );
      else {
        const { id, name, email } = user;
        const payload = { id, name, email };

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
    const fields = pick(req.body, [
      'email',
      'phonenumber',
      'password',
      'first_name',
      'last_name',
      'handle',
      'gender',
      'about'
    ]);

    // email validation
    if (!/(.+)@(.+){2,}\.(.+){2,}/.test(fields.email)) {
      next(
        new Error.BadRequestError({
          message: 'Enter a valid email.'
        })
      );
    }

    // phonenumber validation
    if (!/^[789]\d{9}/.test(fields.phonenumber)) {
      next(
        new Error.BadRequestError({
          message: 'Enter a valid phonenumber.'
        })
      );
    }

    // password validation
    if (fields.password && fields.password.length < 6) {
      next(
        new Error.BadRequestError({
          message: 'Only 6 to 20 character length allowed.'
        })
      );
    }

    try {
      const id = await userRepository.create(fields);
      const user = await userRepository.getUserById(id);
      return res.json(user);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to create the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
