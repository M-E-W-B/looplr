const { delegateToSchema } = require("graphql-tools");

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
    products: async function(root, { collection_id }, ctx) {
      const { productRepository } = ctx;

      try {
        let products;

        if (collection_id)
          products = await productRepository.getProductsByCollectionId(
            collection_id
          );
        else products = await productRepository.getProducts();

        return products;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch products.",
          data: { extra: err.message }
        });
      }
    },
    product: async function(root, { id }, ctx) {
      const { productRepository } = ctx;
      let product;

      try {
        // @TODO
        product = await productRepository.getProductById(id);
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the product.",
          data: { extra: err.message }
        });
      }

      if (product) return product;
      else
        throw new ItemDoesNotExistError({
          message: "Product not found.",
          data: { extra: err.message }
        });
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
  },
  Product: {
    skus: async function({ id }, args, ctx, info) {
      const { schema } = info;
      return delegateToSchema(
        schema,
        {},
        "query",
        "skus",
        { product_id: id },
        ctx,
        info
      );
    },
    images: async function({ id }, args, ctx, info) {
      const { schema } = info;
      return delegateToSchema(
        schema,
        {},
        "query",
        "images",
        { entity_id: id, type: "product" },
        ctx,
        info
      );
    },
    sizechart: async function({ id }, args, ctx, info) {
      const { schema } = info;
      return delegateToSchema(
        schema,
        {},
        "query",
        "images",
        { entity_id: id, type: "product_sizechart" },
        ctx,
        info
      );
    }
  }
};

module.exports = resolvers;
