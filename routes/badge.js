const router = require('express').Router();
const pick = require('lodash/pick');

const Error = require('../utils/errors');

module.exports = ({ badgeRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, ['name', 'description']);

    try {
      const [id] = await badgeRepository.create(fields);
      const badge = await badgeRepository.getBadgeById(id);
      return res.json(badge);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to create the badge.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await badgeRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to delete the badge.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const fields = pick(req.body, ['name', 'description']);

    try {
      await badgeRepository.update(id, fields);
      const badge = await badgeRepository.getBadgeById(id);
      return res.json(badge);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to update the badge.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, name, description, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let badge;

    try {
      badge = await badgeRepository.getBadgeById(id);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to fetch the badge.',
          data: { extra: err.message }
        })
      );
    }

    if (badge) return res.json(badge);
    else
      next(
        new Error.BadRequestError({
          message: 'Badge not found.',
          data: { extra: err.message }
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await badgeRepository.getBadges(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await badgeRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to fetch badges.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
