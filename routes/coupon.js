const router = require('express').Router();
const pick = require('lodash/pick');

module.exports = ({ couponRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, [
      'code',
      'description',
      'max_uses',
      'max_uses_per_user',
      'min_order',
      'is_percentage',
      'discount',
      'start_at',
      'expires_at'
    ]);

    try {
      const [id] = await couponRepository.create(fields);
      const coupon = await couponRepository.getCouponById(id);
      return res.json(coupon);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the coupon.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await couponRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the coupon.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const fields = pick(req.body, [
      'code',
      'description',
      'max_uses',
      'max_uses_per_user',
      'min_order',
      'is_percentage',
      'discount',
      'start_at',
      'expires_at'
    ]);

    try {
      await couponRepository.update(id, fields);
      const coupon = await couponRepository.getCouponById(id);
      return res.json(coupon);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to update the coupon.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, code, description, max_uses, max_uses_per_user, min_order, is_percentage, discount, start_at, expires_at, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    let coupon;
    const { id } = req.params;

    try {
      coupon = await couponRepository.getCouponById(id);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the coupon.',
          data: { extra: err.message }
        })
      );
    }

    if (coupon) return res.json(coupon);
    else
      next(
        new Error({
          message: 'Coupon not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await couponRepository.getCoupons(
        pagination,
        orderings,
        filters
      );

      const pageInfo = couponRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch coupons.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
