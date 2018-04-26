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
    images: async function(root, { entity_id, type }, ctx) {
      const { imageRepository } = ctx;

      try {
        // @TODO
        const images = await imageRepository.getImages(entity_id, type);
        return images;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch images.",
          data: { extra: err.message }
        });
      }
    },
    image: async function(root, { id }, ctx) {
      const { imageRepository } = ctx;
      let image;

      try {
        image = await imageRepository.getImageById(id);
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the image.",
          data: { extra: err.message }
        });
      }

      if (image) return image;
      else
        throw new ItemDoesNotExistError({
          message: "Image not found.",
          data: { extra: err.message }
        });
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
    deleteImage: async function(root, { id }, ctx) {
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
