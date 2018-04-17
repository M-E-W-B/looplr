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
    getUsers: async function(root, args, ctx) {
      const { userRepository } = ctx;

      try {
        const users = await userRepository.getUsers();
        return users;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch users."
        });
      }
    },
    getUserById: async function(root, { id }, ctx) {
      const { userRepository } = ctx;
      try {
        const user = await userRepository.getUserById(id);
        return user;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the user."
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
          message: "Unable to create the user."
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
          message: "Unable to update the user."
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
          message: "Unable to delete the user."
        });
      }
    }
  }
};

module.exports = resolvers;
