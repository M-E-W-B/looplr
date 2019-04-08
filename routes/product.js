const router = require('express').Router();
const Error = require('../utils/errors');
const decode = require('../utils/decode');

// @TODO: delegation: skus
module.exports = ({ productRepository, skuRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    if (req.decoded.isAdmin)
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
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation."
        })
      );
  });

  router.get('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = decode(req.query.q);

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

  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let product;

    try {
      product = await productRepository.getProductById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the product.',
          data: { extra: err.message }
        })
      );
    }

    if (product) {
      try {
        const skus = await skuRepository.getSkusByProductId(id);
        product.skus = skus;

        res.json(product);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to fetch the skus for this product.',
            data: { extra: err.message }
          })
        );
      }
    } else
      return next(
        new Error.BadRequestError({
          message: 'Product not found.'
        })
      );
  });

  return router;
};
