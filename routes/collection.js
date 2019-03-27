const router = require('express').Router();
const pick = require('lodash/pick');

const Error = require('../utils/errors');

module.exports = ({ collectionRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, ['name', 'description', 'owner_id', 'tags']);

    try {
      const id = await collectionRepository.create(fields);
      const collection = await collectionRepository.getCollectionById(id);
      return res.json(collection);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the collection.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await collectionRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to delete the collection.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const fields = pick(req.body, ['name', 'description', 'tags']);

    try {
      await collectionRepository.update(id, fields);
      const collection = await collectionRepository.getCollectionById(id);
      return res.json(collection);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to update the collection.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put(
    '/:collectionId/add-product/:productId',
    async (req, res, next) => {
      const { collectionId, productId } = req.params;

      try {
        await collectionRepository.addProductIntoCollection(
          collectionId,
          productId
        );
        return res.stautus(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            data: { extra: err.message }
          })
        );
      }
    }
  );

  router.put(
    '/:collectionId/remove-product/:productId',
    async (req, res, next) => {
      const { collectionId, productId } = req.params;

      try {
        await collectionRepository.removeProductFromCollection(
          collection_id,
          product_id
        );
        return res.status(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            data: { extra: err.message }
          })
        );
      }
    }
  );

  // { id, name, description, owner_id, tags, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let collection;

    try {
      collection = await collectionRepository.getCollectionById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the collection.',
          data: { extra: err.message }
        })
      );
    }

    if (collection) return res.json(collection);
    else
      return next(
        new Error.BadRequestError({
          message: 'Collection not found.'
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await collectionRepository.getCollections(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await collectionRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch collections.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
