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
    getImages: async function(root, args, ctx) {
      const { imageRepository } = ctx;

      try {
        const images = await imageRepository.getImages();
        return images;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch images.",
          data: { extra: err.message }
        });
      }
    },
    getImageById: async function(root, { id }, ctx) {
      const { imageRepository } = ctx;
      try {
        const image = await imageRepository.getImageById(id);
        return image;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the image.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createImage: async function(root, { fields }, ctx) {
      const { imageRepository } = ctx;

      try {
        const [id] = await imageRepository.create(fields);
        const image = await imageRepository.getImageById(id);
        return image;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the image.",
          data: { extra: err.message }
        });
      }
    },
    updateImage: async function(root, { id, fields }, ctx) {
      const { imageRepository } = ctx;
      try {
        await imageRepository.update(id, fields);
        const image = await imageRepository.getImageById(id);
        return image;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the image.",
          data: { extra: err.message }
        });
      }
    },
    deleteImage: async function(root, { id, fields }, ctx) {
      const { imageRepository } = ctx;
      try {
        await imageRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the image.",
          data: { extra: err.message }
        });
      }
    }
  }
};

module.exports = resolvers;
