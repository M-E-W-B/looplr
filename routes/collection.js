const router = require('express').Router();

module.exports = ({ collectionRepository }) => {
  // { name, description, owner_id, tags }
  router.post('/', async (req, res, next) => {
    try {
      const id = await collectionRepository.create(fields);
      const collection = await collectionRepository.getCollectionById(id);
      return res.json(collection);
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
    try {
      await collectionRepository.delete(id);
      return res.status(200).end();
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
    try {
      await collectionRepository.update(id, fields);
      const collection = await collectionRepository.getCollectionById(id);
      return res.json(collection);
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
      try {
        await collectionRepository.addProductIntoCollection(
          collection_id,
          product_id
        );
        return res.stautus(200).end();
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
      try {
        await collectionRepository.removeProductFromCollection(
          collection_id,
          product_id
        );
        return res.status(200).end();
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

    if (collection) return res.json(collection);
    else
      next(
        new Error({
          message: 'Collection not found.'
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await collectionRepository.getCollections(
        pagination,
        orderings,
        filters
      );

      const pageInfo = collectionRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
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
