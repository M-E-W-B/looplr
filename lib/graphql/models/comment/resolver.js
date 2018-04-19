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
    getComments: async function(root, args, ctx) {
      const { commentRepository } = ctx;

      try {
        const comments = await commentRepository.getComments();
        return comments;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch comments.",
          data: { extra: err.message }
        });
      }
    },
    getCommentById: async function(root, { id }, ctx) {
      const { commentRepository } = ctx;
      try {
        const comment = await commentRepository.getCommentById(id);
        return comment;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the comment.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createComment: async function(root, { fields }, ctx) {
      const { commentRepository } = ctx;

      try {
        const [id] = await commentRepository.create(fields);
        const comment = await commentRepository.getCommentById(id);
        return comment;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the comment.",
          data: { extra: err.message }
        });
      }
    },
    updateComment: async function(root, { id, fields }, ctx) {
      const { commentRepository } = ctx;
      try {
        await commentRepository.update(id, fields);
        const comment = await commentRepository.getCommentById(id);
        return comment;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the comment.",
          data: { extra: err.message }
        });
      }
    },
    deleteComment: async function(root, { id, fields }, ctx) {
      const { commentRepository } = ctx;
      try {
        await commentRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the comment.",
          data: { extra: err.message }
        });
      }
    }
  }
};

module.exports = resolvers;
