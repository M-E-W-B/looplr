const router = require('express').Router();
const Error = require('../utils/errors');

module.exports = ({ imageRepository }) => {
  router.post('/', async (req, res, next) => {
    try {
      const [id] = await imageRepository.create(req.body);
      const image = await imageRepository.getImageById(id);
      return res.json(image);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the image.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await imageRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to delete the image.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await imageRepository.update(id, req.body);
      const image = await imageRepository.getImageById(id);
      return res.json(image);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to update the image.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, entity_id, type, url, thumbnail_url, description, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    let image;
    const { id } = req.params;

    try {
      image = await imageRepository.getImageById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the image.',
          data: { extra: err.message }
        })
      );
    }

    if (image) return res.json(image);
    else
      return next(
        new Error.BadRequestError({
          message: 'Image not found.',
          data: { extra: err.message }
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await imageRepository.getImages(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await imageRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch images.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
