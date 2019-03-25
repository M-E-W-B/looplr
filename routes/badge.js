const router = require('express').Router();

module.exports = ({ badgeRepository }) => {
  // { name, description }
  router.post('/', async (req, res, next) => {
    try {
      const [id] = await badgeRepository.create(fields);
      const badge = await badgeRepository.getBadgeById(id);
      return res.json(badge);
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
    try {
      await badgeRepository.delete(id);
      return res.status(200).end();
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
    try {
      await badgeRepository.update(id, fields);
      const badge = await badgeRepository.getBadgeById(id);
      return res.json(badge);
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

    if (badge) return res.json(badge);
    else
      next(
        new Error({
          message: 'Badge not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await badgeRepository.getBadges(
        pagination,
        orderings,
        filters
      );

      const pageInfo = badgeRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
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
