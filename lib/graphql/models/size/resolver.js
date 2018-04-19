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
    getSizes: async function(root, args, ctx) {
      const { sizeRepository } = ctx;

      try {
        const sizes = await sizeRepository.getSizes();
        return sizes;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch sizes.",
          data: { extra: err.message }
        });
      }
    },
    getSizeById: async function(root, { id }, ctx) {
      const { sizeRepository } = ctx;
      try {
        const size = await sizeRepository.getSizeById(id);
        return size;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the size.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createSize: async function(root, { fields }, ctx) {
      const { sizeRepository } = ctx;

      try {
        const id = await sizeRepository.create(fields);
        const size = await sizeRepository.getSizeById(id);
        return size;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the size.",
          data: { extra: err.message }
        });
      }
    },
    updateSize: async function(root, { id, fields }, ctx) {
      const { sizeRepository } = ctx;
      try {
        await sizeRepository.update(id, fields);
        const size = await sizeRepository.getSizeById(id);
        return size;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the size.",
          data: { extra: err.message }
        });
      }
    },
    deleteSize: async function(root, { id, fields }, ctx) {
      const { sizeRepository } = ctx;
      try {
        await sizeRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the size.",
          data: { extra: err.message }
        });
      }
    }
  }
};

module.exports = resolvers;
