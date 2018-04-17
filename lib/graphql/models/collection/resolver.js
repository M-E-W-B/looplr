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
    getCollections: async function(root, args, ctx) {
      const { collectionRepository } = ctx;

      try {
        const collections = await collectionRepository.getCollections();
        return collections;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch collections."
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
          message: "Unable to fetch the collection."
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
          message: "Unable to create the collection."
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
          message: "Unable to update the collection."
        });
      }
    },
    deleteCollection: async function(root, { id, fields }, ctx) {
      const { collectionRepository } = ctx;
      try {
        await collectionRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the collection."
        });
      }
    }
  }
};

module.exports = resolvers;
