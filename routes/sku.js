const router = require('express').Router();
const pick = require('lodash/pick');
// @TODO: delegation: size, color

module.exports = ({ skuRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, [
      'product_id',
      'sku_attribute_id',
      'stock',
      'price',
      'discount',
      'is_active'
    ]);

    try {
      const [id] = await skuRepository.create(fields);
      const sku = await skuRepository.getSkuById(id);
      return res.json(sku);
    } catch (err) {
      next(
        new Error({
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
      next(
        new Error({
          message: 'Unable to delete the sku.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const fields = pick(req.body, [
      'product_id',
      'sku_attribute_id',
      'stock',
      'price',
      'discount',
      'is_active'
    ]);

    try {
      await skuRepository.update(id, fields);
      const sku = await skuRepository.getSkuById(id);
      return res.json(sku);
    } catch (err) {
      next(
        new Error({
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
      next(
        new Error({
          message: 'Unable to fetch the sku.',
          data: { extra: err.message }
        })
      );
    }

    if (sku) return res.json(sku);
    else
      next(
        new Error({
          message: 'Sku not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await skuRepository.getSkus(pagination, orderings, filters);

      const pageInfo = skuRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return {
        edges,
        pageInfo
      };
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch skus.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
