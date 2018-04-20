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
    getProducts: async function(root, args, ctx) {
      const { productRepository } = ctx;

      try {
        const products = await productRepository.getProducts();
        return products;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch products.",
          data: { extra: err.message }
        });
      }
    },
    getProductById: async function(root, { id }, ctx) {
      const { productRepository } = ctx;
      try {
        const product = await productRepository.getProductById(id);
        return product;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the product.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createProduct: async function(root, { fields }, ctx) {
      const { productRepository } = ctx;

      try {
        const id = await productRepository.create(fields);
        const product = await productRepository.getProductById(id);
        return product;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the product.",
          data: { extra: err.message }
        });
      }
    },
    updateProduct: async function(root, { id, fields }, ctx) {
      const { productRepository } = ctx;
      try {
        await productRepository.update(id, fields);
        const product = await productRepository.getProductById(id);
        return product;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the product.",
          data: { extra: err.message }
        });
      }
    },
    deleteProduct: async function(root, { id }, ctx) {
      const { productRepository } = ctx;
      try {
        await productRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the product.",
          data: { extra: err.message }
        });
      }
    }
  }
};

module.exports = resolvers;
