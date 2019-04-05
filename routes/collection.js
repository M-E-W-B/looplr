const router = require('express').Router();
const Error = require('../utils/errors');
const decode = require('../utils/decode');

module.exports = ({ collectionRepository, productRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    if (req.decoded.isAdmin)
      try {
        const id = await collectionRepository.create(req.body);
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
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation."
        })
      );
  });

  router.delete('/:id', verify, async (req, res, next) => {
    const { id } = req.params;

    if (req.decoded.isAdmin)
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
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation."
        })
      );
  });

  router.put('/:id', verify, async (req, res, next) => {
    const { id } = req.params;

    if (req.decoded.isAdmin)
      try {
        await collectionRepository.update(id, req.body);
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
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation."
        })
      );
  });

  router.put(
    '/:collectionId/add-product/:productId',
    verify,
    async (req, res, next) => {
      const { collectionId, productId } = req.params;

      if (req.decoded.isAdmin)
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
      else
        return next(
          new Error.AuthenticationError({
            message: "You don't have access to perform this operation."
          })
        );
    }
  );

  router.put(
    '/:collectionId/remove-product/:productId',
    verify,
    async (req, res, next) => {
      const { collectionId, productId } = req.params;

      if (req.decoded.isAdmin)
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
      else
        return next(
          new Error.AuthenticationError({
            message: "You don't have access to perform this operation."
          })
        );
    }
  );

  router.get('/:collectionId/list/product', async (req, res, next) => {
    const { collectionId } = req.params;

    try {
      const products = await productRepository.getProductsByCollectionId(
        collectionId
      );
      return res.json(products);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch collections.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = decode(req.query.q);

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

  return router;
};
