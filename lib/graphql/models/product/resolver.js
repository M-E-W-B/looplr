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
          message: "Unable to fetch products."
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
          message: "Unable to fetch the product."
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
          message: "Unable to create the product."
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
          message: "Unable to update the product."
        });
      }
    },
    deleteProduct: async function(root, { id, fields }, ctx) {
      const { productRepository } = ctx;
      try {
        await productRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the product."
        });
      }
    }
  }
};

module.exports = resolvers;
