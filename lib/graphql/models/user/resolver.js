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
    users: async function(root, args, ctx) {
      const { userRepository } = ctx;

      try {
        const users = await userRepository.getUsers();
        return users;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch users.",
          data: { extra: err.message }
        });
      }
    },
    user: async function(root, { id }, ctx) {
      const { userRepository } = ctx;
      try {
        const user = await userRepository.getUserById(id);
        return user;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the user.",
          data: { extra: err.message }
        });
      }
    },
    followers: async function(root, { user_id }, ctx) {
      const { userRepository } = ctx;
      try {
        const users = await userRepository.getFollowers(user_id);
        return users;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch the users.",
          data: { extra: err.message }
        });
      }
    },
    followings: async function(root, { user_id }, ctx) {
      const { userRepository } = ctx;
      try {
        const users = await userRepository.getFollowings(user_id);
        return users;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch the users.",
          data: { extra: err.message }
        });
      }
    }
  },
  Mutation: {
    createUser: async function(root, { fields }, ctx) {
      const { userRepository } = ctx;

      // email validation
      if (!/(.+)@(.+){2,}\.(.+){2,}/.test(fields.email)) {
        throw new ValidationError({
          message: "Enter a valid email."
        });
      }

      // phonenumber validation
      if (!/^[789]\d{9}/.test(fields.phonenumber)) {
        throw new ValidationError({
          message: "Enter a valid phonenumber."
        });
      }

      // password validation
      if (fields.password && fields.password.length < 6) {
        throw new ValidationError({
          message: "Only 6 to 20 character length allowed."
        });
      }

      try {
        const id = await userRepository.create(fields);
        const user = await userRepository.getUserById(id);
        return user;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the user.",
          data: { extra: err.message }
        });
      }
    },
    updateUser: async function(root, { id, fields }, ctx) {
      const { userRepository } = ctx;
      try {
        await userRepository.update(id, fields);
        const user = await userRepository.getUserById(id);
        return user;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the user.",
          data: { extra: err.message }
        });
      }
    },
    deleteUser: async function(root, { id, fields }, ctx) {
      const { userRepository } = ctx;
      try {
        await userRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the user.",
          data: { extra: err.message }
        });
      }
    },
    followUser: async function(root, { user_id, to_follow_user_id }, ctx) {
      const { userRepository } = ctx;
      try {
        await userRepository.followUser(user_id, to_follow_user_id);
        return true;
      } catch (err) {
        throw new UnknownError({
          data: { extra: err.message }
        });
      }
    },
    unfollowUser: async function(root, { user_id, to_unfollow_user_id }, ctx) {
      const { userRepository } = ctx;
      try {
        await userRepository.unfollowUser(user_id, to_unfollow_user_id);
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
