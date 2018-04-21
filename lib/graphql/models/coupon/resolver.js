const {
  ListFetchError,
  ItemFetchError,
  ValidationError,
  CreateError,
  UpdateError,
  DeleteError
} = require("../../utils/errors");

const resolvers = {
  Query: {
    coupon: async function(root, args, ctx) {
      const { couponRepository } = ctx;

      try {
        const coupons = await couponRepository.getCoupons();
        return coupons;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch coupons.",
          data: { extra: err.message }
        });
      }
    },
    coupon: async function(root, { id }, ctx) {
      const { couponRepository } = ctx;
      try {
        const coupon = await couponRepository.getCouponById(id);
        return coupon;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the coupon.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createCoupon: async function(root, { fields }, ctx) {
      const { couponRepository } = ctx;

      try {
        const [id] = await couponRepository.create(fields);
        const coupon = await couponRepository.getCouponById(id);
        return coupon;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the coupon.",
          data: { extra: err.message }
        });
      }
    },
    updateCoupon: async function(root, { id, fields }, ctx) {
      const { couponRepository } = ctx;
      try {
        await couponRepository.update(id, fields);
        const coupon = await couponRepository.getCouponById(id);
        return coupon;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the coupon.",
          data: { extra: err.message }
        });
      }
    },
    deleteCoupon: async function(root, { id }, ctx) {
      const { couponRepository } = ctx;
      try {
        await couponRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the coupon.",
          data: { extra: err.message }
        });
      }
    }
  }
};

module.exports = resolvers;
