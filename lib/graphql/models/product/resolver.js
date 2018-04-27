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
    products: async function(
      root,
      { collection_id, pagination, orderings, filters },
      ctx
    ) {
      const { productRepository } = ctx;

      try {
        let edges;
        let pageInfo = null;

        if (collection_id) {
          edges = await productRepository.getProductsByCollectionId(
            collection_id,
            pagination,
            orderings,
            filters
          );
        } else {
          edges = await productRepository.getProducts(
            pagination,
            orderings,
            filters
          );

          pageInfo = productRepository.getPageInfo(
            pagination,
            orderings,
            filters
          );
        }

        return {
          edges,
          pageInfo
        };
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
    skus: async function({ id }, { orderings = [], filters = [] }, ctx, info) {
      const { schema } = info;
      const pagination = null;

      // adding product_id filter as well
      filters.push({ column: "product_id", value: id });

      return delegateToSchema(
        schema,
        {},
        "query",
        "skus",
        { pagination, orderings, filters },
        ctx,
        info
      );
    },
    images: async function(
      { id },
      { orderings = [], filters = [] },
      ctx,
      info
    ) {
      const { schema } = info;
      const pagination = null;

      // adding entity_id & type filter as well
      filters.push({ column: "entity_id", value: id });
      filters.push({ column: "type", value: "product" });

      return delegateToSchema(
        schema,
        {},
        "query",
        "images",
        { pagination, orderings, filters },
        ctx,
        info
      );
    },
    sizechart: async function(
      { id },
      { orderings = [], filters = [] },
      ctx,
      info
    ) {
      const { schema } = info;
      const pagination = null;

      // adding entity_id & type filter as well
      filters.push({ column: "entity_id", value: id });
      filters.push({ column: "type", value: "product_sizechart" });

      return delegateToSchema(
        schema,
        {},
        "query",
        "images",
        { pagination, orderings, filters },
        ctx,
        info
      );
    }
  }
};

module.exports = resolvers;
