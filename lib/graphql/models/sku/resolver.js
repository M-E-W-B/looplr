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
    skus: async function(root, { product_id }, ctx) {
      const { skuRepository } = ctx;

      try {
        let skus;

        if (product_id)
          skus = await skuRepository.getSkusByProductId(product_id);
        else skus = await skuRepository.getSkus();

        return skus;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch skus.",
          data: { extra: err.message }
        });
      }
    },
    sku: async function(root, { id }, ctx) {
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
    deleteSku: async function(root, { id }, ctx) {
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
  },
  Sku: {
    color: async function({ sku_attribute_id }, args, ctx, info) {
      const { schema } = info;
      return delegateToSchema(
        schema,
        {},
        "query",
        "color",
        { id: sku_attribute_id },
        ctx,
        info
      );
    },
    size: async function({ sku_attribute_id }, args, ctx, info) {
      const { schema } = info;
      return delegateToSchema(
        schema,
        {},
        "query",
        "size",
        { id: sku_attribute_id },
        ctx,
        info
      );
    }
  }
};

module.exports = resolvers;
