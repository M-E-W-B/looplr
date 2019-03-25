const router = require('express').Router();

module.exports = ({ imageRepository }) => {
  // { entity_id, type, url, thumbnail_url, description }
  router.post('/', async (req, res, next) => {
    try {
      const [id] = await imageRepository.create(fields);
      const image = await imageRepository.getImageById(id);
      return res.json(image);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the image.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    try {
      await imageRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the image.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { entity_id, type, url, thumbnail_url, description }
  router.put('/:id', async (req, res, next) => {
    try {
      await imageRepository.update(id, fields);
      const image = await imageRepository.getImageById(id);
      return res.json(image);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to update the image.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, entity_id, type, url, thumbnail_url, description, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    let image;

    try {
      image = await imageRepository.getImageById(id);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the image.',
          data: { extra: err.message }
        })
      );
    }

    if (image) return res.json(image);
    else
      next(
        new Error({
          message: 'Image not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await imageRepository.getImages(
        pagination,
        orderings,
        filters
      );

      const pageInfo = imageRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch images.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
