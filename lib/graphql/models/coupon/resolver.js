const {
  ListFetchError,
  ItemFetchError,
  ValidationError,
  CreateError,
  UpdateError,
  DeleteError,
  ItemDoesNotExistError
} = require("../../utils/errors");

const resolvers = {
  Query: {
    coupon: async function(root, { pagination, orderings, filters }, ctx) {
      const { couponRepository } = ctx;

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

        return {
          edges,
          pageInfo
        };
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch coupons.",
          data: { extra: err.message }
        });
      }
    },
    coupon: async function(root, { id }, ctx) {
      const { couponRepository } = ctx;
      let coupon;

      try {
        coupon = await couponRepository.getCouponById(id);
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the coupon.",
          data: { extra: err.message }
        });
      }

      if (coupon) return coupon;
      else
        throw new ItemDoesNotExistError({
          message: "Coupon not found.",
          data: { extra: err.message }
        });
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
