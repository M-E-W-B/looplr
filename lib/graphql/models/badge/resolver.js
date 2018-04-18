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
    getBadges: async function(root, args, ctx) {
      const { badgeRepository } = ctx;

      try {
        const badges = await badgeRepository.getBadges();
        return badges;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch badges."
        });
      }
    },
    getBadgeById: async function(root, { id }, ctx) {
      const { badgeRepository } = ctx;
      try {
        const badge = await badgeRepository.getBadgeById(id);
        return badge;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the badge."
        });
      }
    }
  },
  Mutation: {
    createBadge: async function(root, { fields }, ctx) {
      const { badgeRepository } = ctx;

      try {
        const [id] = await badgeRepository.create(fields);
        const badge = await badgeRepository.getBadgeById(id);
        return badge;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the badge."
        });
      }
    },
    updateBadge: async function(root, { id, fields }, ctx) {
      const { badgeRepository } = ctx;
      try {
        await badgeRepository.update(id, fields);
        const badge = await badgeRepository.getBadgeById(id);
        return badge;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the badge."
        });
      }
    },
    deleteBadge: async function(root, { id, fields }, ctx) {
      const { badgeRepository } = ctx;
      try {
        await badgeRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the badge."
        });
      }
    }
  }
};

module.exports = resolvers;
