const router = require('express').Router();
const Error = require('../utils/errors');

module.exports = ({ userRepository }) => {
  router.delete('/', async (req, res, next) => {
    const { id } = req.decoded;

    try {
      await userRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to delete the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/', async (req, res, next) => {
    const { id } = req.decoded;

    try {
      await userRepository.update(id, req.body);
      const user = await userRepository.getUserById(id);
      return res.json(user);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to update the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, first_name, last_name, handle, email, gender, phonenumber, about, reset_password_token, reset_password_expires_at, is_active, created_at, updated_at, deleted_at }
  router.get('/', async (req, res, next) => {
    let user;
    const { id } = req.decoded;

    try {
      user = await userRepository.getUserById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the user.',
          data: { extra: err.message }
        })
      );
    }

    if (user) return res.json(user);
    else
      return next(
        new Error.BadRequestError({
          message: 'User not found.',
          data: { extra: err.message }
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await userRepository.getUsers(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await userRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({
        edges,
        pageInfo
      });
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch users.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.post('/follow/:id', async (req, res, next) => {
    const { id: toFollowUserId } = req.params;
    const { id } = req.decoded;

    try {
      await userRepository.followUser(id, toFollowUserId);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          data: { extra: err.message }
        })
      );
    }
  });

  router.post('/unfollow/:id', async (req, res, next) => {
    const { id: toUnfollowUserId } = req.params;
    const { id } = req.decoded;

    try {
      await userRepository.unfollowUser(id, toUnfollowUserId);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/followings', async (req, res, next) => {
    const { id } = req.decoded;

    try {
      const users = await userRepository.getFollowings(id);
      return res.json(users);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the users.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/followers', async (req, res, next) => {
    const { id } = req.decoded;

    try {
      const users = await userRepository.getFollowers(id);
      return res.json(users);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the users.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
