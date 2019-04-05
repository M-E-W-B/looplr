const router = require('express').Router();
const Error = require('../utils/errors');
const decode = require('../utils/decode');

module.exports = ({ couponRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    if (req.decoded.isAdmin)
      try {
        const [id] = await couponRepository.create(req.body);
        const coupon = await couponRepository.getCouponById(id);
        return res.json(coupon);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to create the coupon.',
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
        await couponRepository.delete(id);
        return res.status(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to delete the coupon.',
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
        await couponRepository.update(id, req.body);
        const coupon = await couponRepository.getCouponById(id);

        return res.json(coupon);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to update the coupon.',
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

  router.get('/list/:cartId', async (req, res, next) => {
    const pagination = null;
    const orderings = null;
    // @TODO: pass cartId and then calculate totalOrder value
    const filters = [
      {
        column: 'min_order',
        value: [req.body.orderValue],
        operator: 'GREATER_THAN_OR_EQUAL'
      }
    ];

    try {
      const coupons = await couponRepository.getCoupons(
        pagination,
        orderings,
        filters
      );

      return res.json(coupons);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch coupons.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/:id', async (req, res, next) => {
    let coupon;
    const { id } = req.params;

    try {
      coupon = await couponRepository.getCouponById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the coupon.',
          data: { extra: err.message }
        })
      );
    }

    if (coupon) return res.json(coupon);
    else
      return next(
        new Error.BadRequestError({
          message: 'Coupon not found.'
        })
      );
  });

  return router;
};
