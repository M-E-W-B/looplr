const router = require('express').Router();

module.exports = ({ userRepository }) => {
  // { first_name, last_name, handle, email, gender, phonenumber, about }
  router.post('/', async (req, res, next) => {
    // email validation
    if (!/(.+)@(.+){2,}\.(.+){2,}/.test(fields.email)) {
      next(
        new Error({
          message: 'Enter a valid email.'
        })
      );
    }

    // phonenumber validation
    if (!/^[789]\d{9}/.test(fields.phonenumber)) {
      next(
        new Error({
          message: 'Enter a valid phonenumber.'
        })
      );
    }

    // password validation
    if (fields.password && fields.password.length < 6) {
      next(
        new Error({
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
        new Error({
          message: 'Unable to create the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
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

  // { first_name, last_name, handle, email, gender, phonenumber, about }
  router.put('/:id', async (req, res, next) => {
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
  router.get('/:id', async (req, res, next) => {
    let user;

    try {
      user = await userRepository.getUserById(id);
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

  router.post('/follow', async (req, res, next) => {
    try {
      await userRepository.followUser(user_id, to_follow_user_id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          data: { extra: err.message }
        })
      );
    }
  });

  router.post('/unfollow', async (req, res, next) => {
    try {
      await userRepository.unfollowUser(user_id, to_unfollow_user_id);
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
      const users = await userRepository.getFollowings(user_id);
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
      const users = await userRepository.getFollowers(user_id);
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
