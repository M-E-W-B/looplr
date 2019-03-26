const router = require('express').Router();
const pick = require('lodash/pick');

const Error = require('../utils/errors');

module.exports = ({ sizeRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, ['name']);

    try {
      const id = await sizeRepository.create(fields);
      const size = await sizeRepository.getSizeById(id);
      return res.json(size);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to create the size.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await sizeRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to delete the size.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const fields = pick(req.body, ['name']);

    try {
      await sizeRepository.update(id, fields);
      const size = await sizeRepository.getSizeById(id);
      return res.json(size);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to update the size.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, name, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let size;

    try {
      size = await sizeRepository.getSizeById(id);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to fetch the size.',
          data: { extra: err.message }
        })
      );
    }

    if (size) return res.json(size);
    else
      next(
        new Error.BadRequestError({
          message: 'Size not found.',
          data: { extra: err.message }
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await sizeRepository.getSizes(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await sizeRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to fetch sizes.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
