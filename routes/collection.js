const router = require('express').Router();

module.exports = ctx => {
  // { name, description, owner_id, tags }
  router.post('/', async (req, res, next) => {
    const { collectionRepository } = ctx;

    try {
      const id = await collectionRepository.create(fields);
      const collection = await collectionRepository.getCollectionById(id);
      return collection;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the collection.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    const { collectionRepository } = ctx;
    try {
      await collectionRepository.delete(id);
      return true;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the collection.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { name, description, tags }
  router.put('/:id', async (req, res, next) => {
    const { collectionRepository } = ctx;
    try {
      await collectionRepository.update(id, fields);
      const collection = await collectionRepository.getCollectionById(id);
      return collection;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to update the collection.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { collection_id, product_id }
  router.put(
    '/:collectionId/add-product/:productId',
    async (req, res, next) => {
      const { collectionRepository } = ctx;
      try {
        await collectionRepository.addProductIntoCollection(
          collection_id,
          product_id
        );
        return true;
      } catch (err) {
        next(
          new Error({
            data: { extra: err.message }
          })
        );
      }
    }
  );

  // { collection_id, product_id }
  router.put(
    '/:collectionId/remove-product/:productId',
    async (req, res, next) => {
      const { collectionRepository } = ctx;
      try {
        await collectionRepository.removeProductFromCollection(
          collection_id,
          product_id
        );
        return true;
      } catch (err) {
        next(
          new Error({
            data: { extra: err.message }
          })
        );
      }
    }
  );

  // { id, name, description, owner_id, tags, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { collectionRepository } = ctx;
    let collection;

    try {
      collection = await collectionRepository.getCollectionById(id);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the collection.',
          data: { extra: err.message }
        })
      );
    }

    if (collection) return collection;
    else
      next(
        new Error({
          message: 'Collection not found.'
        })
      );
  });

  router.get('/', async (req, res, next) => {
    const { collectionRepository } = ctx;

    try {
      let collections;

      if (user_id)
        collections = await collectionRepository.getCollectionsByUserId(
          user_id
        );
      else collections = await collectionRepository.getCollections();

      return collections;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch collections.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
