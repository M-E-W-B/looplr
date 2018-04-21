const { delegateToSchema } = require("graphql-tools");

const {
  ListFetchError,
  ItemFetchError,
  ValidationError,
  CreateError,
  UpdateError,
  DeleteError,
  UnknownError
} = require("../../utils/errors");

const resolvers = {
  Query: {
    collections: async function(root, { user_id }, ctx) {
      const { collectionRepository } = ctx;

      try {
        let collections;

        if (user_id)
          collections = await collectionRepository.getCollectionsByUserId(
            user_id
          );
        else collections = await collectionRepository.getCollections();

        return collections;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch collections.",
          data: { extra: err.message }
        });
      }
    },
    collection: async function(root, { id }, ctx) {
      const { collectionRepository } = ctx;
      try {
        const collection = await collectionRepository.getCollectionById(id);
        return collection;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the collection.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createCollection: async function(root, { fields }, ctx) {
      const { collectionRepository } = ctx;

      try {
        const id = await collectionRepository.create(fields);
        const collection = await collectionRepository.getCollectionById(id);
        return collection;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the collection.",
          data: { extra: err.message }
        });
      }
    },
    updateCollection: async function(root, { id, fields }, ctx) {
      const { collectionRepository } = ctx;
      try {
        await collectionRepository.update(id, fields);
        const collection = await collectionRepository.getCollectionById(id);
        return collection;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the collection.",
          data: { extra: err.message }
        });
      }
    },
    deleteCollection: async function(root, { id }, ctx) {
      const { collectionRepository } = ctx;
      try {
        await collectionRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the collection.",
          data: { extra: err.message }
        });
      }
    },
    addProductIntoCollection: async function(
      root,
      { collection_id, product_id },
      ctx
    ) {
      const { collectionRepository } = ctx;
      try {
        await collectionRepository.addProductIntoCollection(
          collection_id,
          product_id
        );
        return true;
      } catch (err) {
        throw new UnknownError({
          data: { extra: err.message }
        });
      }
    },
    removeProductFromCollection: async function(
      root,
      { collection_id, product_id },
      ctx
    ) {
      const { collectionRepository } = ctx;
      try {
        await collectionRepository.removeProductFromCollection(
          collection_id,
          product_id
        );
        return true;
      } catch (err) {
        throw new UnknownError({
          data: { extra: err.message }
        });
      }
    }
  },
  Collection: {
    user: async function({ user_id }, args, ctx, info) {
      const { schema } = info;
      return delegateToSchema(
        schema,
        {},
        "query",
        "user",
        { id: user_id },
        ctx,
        info
      );
    },
    products: async function({ id }, args, ctx, info) {
      const { schema } = info;
      return delegateToSchema(
        schema,
        {},
        "query",
        "products",
        { collection_id: id },
        ctx,
        info
      );
    }
  }
};

module.exports = resolvers;
