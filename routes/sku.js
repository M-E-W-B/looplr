const router = require('express').Router();
// @TODO: delegation: size, color

module.exports = ctx => {
  // { product_id, sku_attribute_id, stock, price, discount, is_active }
  router.post('/', async (req, res, next) => {
    const { skuRepository } = ctx;

    try {
      const [id] = await skuRepository.create(fields);
      const sku = await skuRepository.getSkuById(id);
      return sku;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the sku.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    const { skuRepository } = ctx;
    try {
      await skuRepository.delete(id);
      return true;
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the sku.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { product_id, sku_attribute_id, stock, price, discount, is_active }
  router.put('/:id', async (req, res, next) => {
    const { skuRepository } = ctx;
    try {
      await skuRepository.update(id, fields);
      const sku = await skuRepository.getSkuById(id);
      return sku;
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
    const { skuRepository } = ctx;
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

    if (sku) return sku;
    else
      next(
        new Error({
          message: 'Sku not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    const { skuRepository } = ctx;

    try {
      let skus;

      if (product_id) skus = await skuRepository.getSkusByProductId(product_id);
      else skus = await skuRepository.getSkus();

      return skus;
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
