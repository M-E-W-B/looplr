const router = require('express').Router();
const Error = require('../utils/errors');

// @TODO: delegation: skus

module.exports = ({ productRepository }) => {
  router.post('/', async (req, res, next) => {
    try {
      const id = await productRepository.create(req.body);
      const product = await productRepository.getProductById(id);
      return res.json(product);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the product.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await productRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to delete the product.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await productRepository.update(id, req.body);
      const product = await productRepository.getProductById(id);
      return res.json(product);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to update the product.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, name, category, subcategory, description, image, sizechart, storename, gender, tags, promotional_text, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let product;

    try {
      // @TODO
      product = await productRepository.getProductById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the product.',
          data: { extra: err.message }
        })
      );
    }

    if (product) return res.json(product);
    else
      return next(
        new Error.BadRequestError({
          message: 'Product not found.',
          data: { extra: err.message }
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters, collectionId } = req.body;

    try {
      const edges = await productRepository.getProducts(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await productRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({
        edges,
        pageInfo
      });
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch products.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
