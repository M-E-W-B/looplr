const router = require('express').Router();

module.exports = ctx => {
  // { entity_id, type, url, thumbnail_url, description }
  router.post('/', async (req, res, next) => {
    const { imageRepository } = ctx;

    try {
      const [id] = await imageRepository.create(fields);
      const image = await imageRepository.getImageById(id);
      return image;
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
    const { imageRepository } = ctx;
    try {
      await imageRepository.delete(id);
      return true;
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
    const { imageRepository } = ctx;
    try {
      await imageRepository.update(id, fields);
      const image = await imageRepository.getImageById(id);
      return image;
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
    const { imageRepository } = ctx;
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

    if (image) return image;
    else
      next(
        new Error({
          message: 'Image not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    const { imageRepository } = ctx;

    try {
      // @TODO
      const images = await imageRepository.getImages(entity_id, type);
      return images;
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
