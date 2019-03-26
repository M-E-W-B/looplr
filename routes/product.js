const router = require('express').Router();
const pick = require('lodash/pick');

const Error = require('../utils/errors');

// @TODO: delegation: skus, images, sizechart

module.exports = ({ productRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, [
      'name',
      'category',
      'subcategory',
      'description',
      'storename',
      'gender',
      'tags',
      'promotional_text'
    ]);

    try {
      const id = await productRepository.create(fields);
      const product = await productRepository.getProductById(id);
      return res.json(product);
    } catch (err) {
      next(
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
      next(
        new Error.BadRequestError({
          message: 'Unable to delete the product.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const fields = pick(req.body, [
      'name',
      'category',
      'subcategory',
      'description',
      'storename',
      'gender',
      'tags',
      'promotional_text'
    ]);

    try {
      await productRepository.update(id, fields);
      const product = await productRepository.getProductById(id);
      return res.json(product);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to update the product.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, name, category, subcategory, description, storename, gender, tags, promotional_text, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let product;

    try {
      // @TODO
      product = await productRepository.getProductById(id);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to fetch the product.',
          data: { extra: err.message }
        })
      );
    }

    if (product) return res.json(product);
    else
      next(
        new Error.BadRequestError({
          message: 'Product not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      let edges;
      let pageInfo = null;

      if (collection_id) {
        edges = await productRepository.getProductsByCollectionId(
          collection_id,
          pagination,
          orderings,
          filters
        );
      } else {
        edges = await productRepository.getProducts(
          pagination,
          orderings,
          filters
        );

        pageInfo = productRepository.getPageInfo(
          pagination,
          orderings,
          filters
        );
      }

      return {
        edges,
        pageInfo
      };
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to fetch products.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
