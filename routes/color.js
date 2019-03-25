const router = require('express').Router();

module.exports = ctx => {
  // { hexcode }
  router.post('/', async (req, res, next) => {
    const { colorRepository } = ctx;

    try {
      const id = await colorRepository.create(fields);
      const color = await colorRepository.getColorById(id);
      return color;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the color.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    const { colorRepository } = ctx;
    try {
      await colorRepository.delete(id);
      return true;
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
    const { colorRepository } = ctx;
    try {
      await colorRepository.update(id, fields);
      const color = await colorRepository.getColorById(id);
      return color;
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
    const { colorRepository } = ctx;
    let color;

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

    if (color) return color;
    else
      next(
        new Error({
          message: 'Color not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    const { colorRepository } = ctx;

    try {
      const colors = await colorRepository.getColors();
      return colors;
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
