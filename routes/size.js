const router = require('express').Router();

module.exports = ({ sizeRepository }) => {
  // { name }
  router.post('/', async (req, res, next) => {
    try {
      const id = await sizeRepository.create(fields);
      const size = await sizeRepository.getSizeById(id);
      return res.json(size);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the size.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    try {
      await sizeRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the size.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { name }
  router.put('/:id', async (req, res, next) => {
    try {
      await sizeRepository.update(id, fields);
      const size = await sizeRepository.getSizeById(id);
      return res.json(size);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to update the size.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, name, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    let size;

    try {
      size = await sizeRepository.getSizeById(id);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the size.',
          data: { extra: err.message }
        })
      );
    }

    if (size) return res.json(size);
    else
      next(
        new Error({
          message: 'Size not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await sizeRepository.getSizes(
        pagination,
        orderings,
        filters
      );

      const pageInfo = sizeRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch sizes.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
