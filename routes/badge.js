const router = require('express').Router();

module.exports = ctx => {
  // { name, description }
  router.post('/', async (req, res, next) => {
    const { badgeRepository } = ctx;

    try {
      const [id] = await badgeRepository.create(fields);
      const badge = await badgeRepository.getBadgeById(id);
      return badge;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the badge.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    const { badgeRepository } = ctx;
    try {
      await badgeRepository.delete(id);
      return true;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the badge.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { name, description }
  router.put('/:id', async (req, res, next) => {
    const { badgeRepository } = ctx;
    try {
      await badgeRepository.update(id, fields);
      const badge = await badgeRepository.getBadgeById(id);
      return badge;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to update the badge.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, name, description, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { badgeRepository } = ctx;
    let badge;

    try {
      badge = await badgeRepository.getBadgeById(id);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the badge.',
          data: { extra: err.message }
        })
      );
    }

    if (badge) return badge;
    else
      next(
        new Error({
          message: 'Badge not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    const { badgeRepository } = ctx;

    try {
      const badges = await badgeRepository.getBadges();
      return badges;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch badges.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
