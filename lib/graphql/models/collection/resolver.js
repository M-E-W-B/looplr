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
    getCollections: async function(root, args, ctx) {
      const { collectionRepository } = ctx;

      try {
        const collections = await collectionRepository.getCollections();
        return collections;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch collections.",
          data: { extra: err.message }
        });
      }
    },
    getCollectionById: async function(root, { id }, ctx) {
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
    },
    getCollectionsByUserId: async function(root, { user_id }, ctx) {
      const { collectionRepository } = ctx;
      try {
        const collections = await collectionRepository.getCollectionsByUserId(
          user_id
        );
        return collections;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch the collections.",
          data: { extra: err.message }
        });
      }
    },
    getProductsByCollectionId: async function(root, { collection_id }, ctx) {
      const { collectionRepository } = ctx;
      try {
        const products = await collectionRepository.getProductsByCollectionId(
          collection_id
        );
        return products;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch the products.",
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
  }
};

module.exports = resolvers;
