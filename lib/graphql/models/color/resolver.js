const {
  ListFetchError,
  ItemFetchError,
  ValidationError,
  CreateError,
  UpdateError,
  DeleteError,
  ItemDoesNotExistError
} = require("../../utils/errors");

const resolvers = {
  Query: {
    colors: async function(root, { pagination, orderings, filters }, ctx) {
      const { colorRepository } = ctx;

      try {
        const edges = await colorRepository.getColors(
          pagination,
          orderings,
          filters
        );

        const pageInfo = colorRepository.getPageInfo(
          pagination,
          orderings,
          filters
        );

        return {
          edges,
          pageInfo
        };
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch colors.",
          data: { extra: err.message }
        });
      }
    },
    color: async function(root, { id }, ctx) {
      const { colorRepository } = ctx;

      try {
        const color = await colorRepository.getColorById(id);
        if (color) return color;
        else return null;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the color.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createColor: async function(root, { fields }, ctx) {
      const { colorRepository } = ctx;

      try {
        const id = await colorRepository.create(fields);
        const color = await colorRepository.getColorById(id);

        return color;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the color.",
          data: { extra: err.message }
        });
      }
    },
    updateColor: async function(root, { id, fields }, ctx) {
      const { colorRepository } = ctx;
      try {
        await colorRepository.update(id, fields);
        const color = await colorRepository.getColorById(id);

        return color;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the color.",
          data: { extra: err.message }
        });
      }
    },
    deleteColor: async function(root, { id }, ctx) {
      const { colorRepository } = ctx;
      try {
        await colorRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the color.",
          data: { extra: err.message }
        });
      }
    }
  }
};

module.exports = resolvers;
