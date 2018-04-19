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
    getSkus: async function(root, args, ctx) {
      const { skuRepository } = ctx;

      try {
        const skus = await skuRepository.getSkus();
        return skus;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch skus.",
          data: { extra: err.message }
        });
      }
    },
    getSkuById: async function(root, { id }, ctx) {
      const { skuRepository } = ctx;
      try {
        const sku = await skuRepository.getSkuById(id);
        return sku;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the sku.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createSku: async function(root, { fields }, ctx) {
      const { skuRepository } = ctx;

      try {
        const [id] = await skuRepository.create(fields);
        const sku = await skuRepository.getSkuById(id);
        return sku;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the sku.",
          data: { extra: err.message }
        });
      }
    },
    updateSku: async function(root, { id, fields }, ctx) {
      const { skuRepository } = ctx;
      try {
        await skuRepository.update(id, fields);
        const sku = await skuRepository.getSkuById(id);
        return sku;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the sku.",
          data: { extra: err.message }
        });
      }
    },
    deleteSku: async function(root, { id, fields }, ctx) {
      const { skuRepository } = ctx;
      try {
        await skuRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the sku.",
          data: { extra: err.message }
        });
      }
    }
  }
};

module.exports = resolvers;
