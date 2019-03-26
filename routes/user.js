const router = require('express').Router();
const pick = require('lodash/pick');

module.exports = ({ userRepository }) => {
  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await userRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const fields = pick(req.body, [
      'first_name',
      'last_name',
      'handle',
      'email',
      'gender',
      'phonenumber',
      'about'
    ]);

    try {
      await userRepository.update(id, fields);
      const user = await userRepository.getUserById(id);
      return res.json(user);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to update the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, first_name, last_name, handle, email, gender, phonenumber, about, reset_password_token, reset_password_expires_at, is_active, created_at, updated_at, deleted_at }
  router.get('/me', async (req, res, next) => {
    let user;

    try {
      user = await userRepository.getUserById(req.decoded.id);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the user.',
          data: { extra: err.message }
        })
      );
    }

    if (user) return res.json(user);
    else
      next(
        new Error({
          message: 'User not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await userRepository.getUsers(
        pagination,
        orderings,
        filters
      );

      const pageInfo = userRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return {
        edges,
        pageInfo
      };
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch users.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.post('/follow/:id', async (req, res, next) => {
    const { id: toFollowUserId } = req.params;

    try {
      await userRepository.followUser(req.decoded.id, toFollowUserId);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          data: { extra: err.message }
        })
      );
    }
  });

  router.post('/unfollow/:id', async (req, res, next) => {
    const { id: toUnfollowUserId } = req.params;

    try {
      await userRepository.unfollowUser(req.decoded.id, toUnfollowUserId);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/followings', async (req, res, next) => {
    try {
      const users = await userRepository.getFollowings(req.decoded.id);
      return res.json(users);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the users.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/followers', async (req, res, next) => {
    try {
      const users = await userRepository.getFollowers(req.decoded.id);
      return res.json(users);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the users.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
