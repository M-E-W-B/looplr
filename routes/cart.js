const router = require('express').Router();
const Error = require('../utils/errors');

module.exports = ({ cartRepository }, { verify }) => {
  router.put('/increase/quantity/:skuId', verify, async (req, res, next) => {
    try {
      const cartId = await cartRepository.getCartIdByUserId(req.decoded.id);
      await cartRepository.increaseCartItem(cartId, req.params.skuId);

      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to increase quantity of the cart item.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/decrease/quantity/:skuId', verify, async (req, res, next) => {
    try {
      const cartId = await cartRepository.getCartIdByUserId(req.decoded.id);
      await cartRepository.decreaseCartItem(cartId, req.params.skuId);

      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to decrease quantity of the cart item.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/add/:skuId', verify, async (req, res, next) => {
    try {
      const cartId = await cartRepository.getCartIdByUserId(req.decoded.id);
      await cartRepository.addProductSkuIntoCart(cartId, req.params.skuId);

      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to add into cart.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/remove/:skuId', verify, async (req, res, next) => {
    try {
      const cartId = await cartRepository.getCartIdByUserId(req.decoded.id);
      await cartRepository.removeProductSkuFromCart(cartId, req.params.skuId);

      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to remove from cart.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
