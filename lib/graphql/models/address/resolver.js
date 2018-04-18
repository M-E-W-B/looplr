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
    getAddresss: async function(root, args, ctx) {
      const { addressRepository } = ctx;

      try {
        const addresss = await addressRepository.getAddresss();
        return addresss;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch addresss."
        });
      }
    },
    getAddressById: async function(root, { id }, ctx) {
      const { addressRepository } = ctx;
      try {
        const address = await addressRepository.getAddressById(id);
        return address;
      } catch (err) {
        throw new ItemFetchError({
          message: "Unable to fetch the address."
        });
      }
    }
  },
  Mutation: {
    createAddress: async function(root, { fields }, ctx) {
      const { addressRepository } = ctx;

      try {
        const [id] = await addressRepository.create(fields);
        const address = await addressRepository.getAddressById(id);
        return address;
      } catch (err) {
        throw new CreateError({
          message: "Unable to create the address."
        });
      }
    },
    updateAddress: async function(root, { id, fields }, ctx) {
      const { addressRepository } = ctx;
      try {
        await addressRepository.update(id, fields);
        const address = await addressRepository.getAddressById(id);
        return address;
      } catch (err) {
        throw new UpdateError({
          message: "Unable to update the address."
        });
      }
    },
    deleteAddress: async function(root, { id, fields }, ctx) {
      const { addressRepository } = ctx;
      try {
        await addressRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the address."
        });
      }
    }
  }
};

module.exports = resolvers;
