const router = require('express').Router();
const Error = require('../utils/errors');

module.exports = ({ colorRepository }) => {
  router.post('/', async (req, res, next) => {
    try {
      const id = await colorRepository.create(req.body);
      const color = await colorRepository.getColorById(id);
      return res.json(color);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the color.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await colorRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to delete the color.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { hexcode }
  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await colorRepository.update(id, req.body);
      const color = await colorRepository.getColorById(id);
      return res.json(color);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to update the color.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, hexcode, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    let color;
    const { id } = req.params;

    try {
      color = await colorRepository.getColorById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the color.',
          data: { extra: err.message }
        })
      );
    }

    if (color) return res.json(color);
    else
      return next(
        new Error.BadRequestError({
          message: 'Color not found.',
          data: { extra: err.message }
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await colorRepository.getColors(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await colorRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch colors.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
