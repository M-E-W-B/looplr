const router = require('express').Router();
const Error = require('../utils/errors');
// @TODO: delegation: size, color

module.exports = ({ skuRepository }) => {
  router.post('/', async (req, res, next) => {
    try {
      const [id] = await skuRepository.create(req.body);
      const sku = await skuRepository.getSkuById(id);
      return res.json(sku);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the sku.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await skuRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to delete the sku.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await skuRepository.update(id, req.body);
      const sku = await skuRepository.getSkuById(id);
      return res.json(sku);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to update the sku.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, product_id, sku_attribute_id, stock, price, discount, is_active, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let sku;

    try {
      sku = await skuRepository.getSkuById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the sku.',
          data: { extra: err.message }
        })
      );
    }

    if (sku) return res.json(sku);
    else
      return next(
        new Error.BadRequestError({
          message: 'Sku not found.',
          data: { extra: err.message }
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await skuRepository.getSkus(pagination, orderings, filters);

      const pageInfo = await skuRepository.getPageInfo(
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
          message: 'Unable to fetch skus.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
