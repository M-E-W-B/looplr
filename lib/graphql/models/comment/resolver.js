const { delegateToSchema } = require("graphql-tools");

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
    comments: async function(root, { pagination, orderings, filters }, ctx) {
      const { commentRepository } = ctx;

      try {
        const edges = await commentRepository.getComments(
          pagination,
          orderings,
          filters
        );

        const pageInfo = commentRepository.getPageInfo(
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
          message: "Unable to fetch comments.",
          data: { extra: err.message }
        });
      }
    },
    comment: async function(root, { id }, ctx) {
      const { commentRepository } = ctx;
      let comment;

      try {
        comment = await commentRepository.getCommentById(id);
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the comment.",
          data: { extra: err.message }
        });
      }

      if (comment) return comment;
      else
        throw new ItemDoesNotExistError({
          message: "Comment not found.",
          data: { extra: err.message }
        });
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
    deleteComment: async function(root, { id }, ctx) {
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
  },
  Comment: {
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
    }
  }
};

module.exports = resolvers;
