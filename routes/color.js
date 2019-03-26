const router = require('express').Router();
const pick = require('lodash/pick');

module.exports = ({ colorRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, ['hexcode']);

    try {
      const id = await colorRepository.create(fields);
      const color = await colorRepository.getColorById(id);
      return res.json(color);
    } catch (err) {
      next(
        new Error({
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
      next(
        new Error({
          message: 'Unable to delete the color.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { hexcode }
  router.put('/:id', async (req, res, next) => {
    const fields = pick(req.body, ['hexcode']);
    const { id } = req.params;

    try {
      await colorRepository.update(id, fields);
      const color = await colorRepository.getColorById(id);
      return res.json(color);
    } catch (err) {
      next(
        new Error({
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
      next(
        new Error({
          message: 'Unable to fetch the color.',
          data: { extra: err.message }
        })
      );
    }

    if (color) return res.json(color);
    else
      next(
        new Error({
          message: 'Color not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await colorRepository.getColors(
        pagination,
        orderings,
        filters
      );

      const pageInfo = colorRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch colors.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
