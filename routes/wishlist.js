const router = require('express').Router();
const Error = require('../utils/errors');

module.exports = ({ wishlistRepository }, { verify }) => {
  router.put('/add/:skuId', verify, async (req, res, next) => {
    try {
      await wishlistRepository.addProductSkuIntoWishlist(
        req.decoded.id,
        req.params.skuId
      );
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to add into wishlist.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/remove/:skuId', verify, async (req, res, next) => {
    try {
      await wishlistRepository.removeProductSkuFromWishlist(
        req.decoded.id,
        req.params.skuId
      );
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to remove from wishlist.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
