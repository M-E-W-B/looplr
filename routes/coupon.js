const router = require('express').Router();

module.exports = ctx => {
  // { code, description, max_uses, max_uses_per_user, min_order, is_percentage, discount, start_at, expires_at }
  router.post('/', async (req, res, next) => {
    const { couponRepository } = ctx;

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

  // { id }
  router.delete('/:id', async (req, res, next) => {
    const { couponRepository } = ctx;
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

  // { code, description, max_uses, max_uses_per_user, min_order, is_percentage, discount, start_at, expires_at }
  router.put('/:id', async (req, res, next) => {
    const { couponRepository } = ctx;
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
    const { couponRepository } = ctx;
    let coupon;

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
    const { couponRepository } = ctx;

    try {
      const coupons = await couponRepository.getCoupons();
      return res.json(coupons);
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
