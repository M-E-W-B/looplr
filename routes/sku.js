const router = require('express').Router();
const Error = require('../utils/errors');
const decode = require('../utils/decode');

// @TODO: delegation: size, color
module.exports = ({ skuRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    if (req.decoded.isAdmin)
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
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation."
        })
      );
  });

  router.get('/list/product/:productId', async (req, res, next) => {
    const pagination = null;
    const orderings = null;
    const filters = [
      {
        column: 'product_id',
        value: [req.params.productId],
        operator: 'EQUAL'
      }
    ];

    try {
      const skus = await skuRepository.getSkus(pagination, orderings, filters);
      return res.json(skus);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch skus.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, product_id, sku_attribute_id, stock, price, discount, is_active, created_at, updated_at, deleted_at }
  // router.get('/:id', async (req, res, next) => {
  //   const { id } = req.params;
  //   let sku;

  //   try {
  //     sku = await skuRepository.getSkuById(id);
  //   } catch (err) {
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Unable to fetch the sku.',
  //         data: { extra: err.message }
  //       })
  //     );
  //   }

  //   if (sku) return res.json(sku);
  //   else
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Sku not found.'
  //       })
  //     );
  // });

  return router;
};
