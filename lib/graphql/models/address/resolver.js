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
    getAddresses: async function(root, args, ctx) {
      const { addressRepository } = ctx;

      try {
        const addresses = await addressRepository.getAddresses();
        return addresses;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch addresses.",
          data: { extra: err.message }
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
          message: "Unable to fetch the address.",
          data: { extra: err.message }
        });
      }
    },
    getAddressesByUserId: async function(root, { user_id }, ctx) {
      const { addressRepository } = ctx;
      try {
        const addresses = await addressRepository.getAddressesByUserId(user_id);
        return addresses;
      } catch (err) {
        throw new ListFetchError({
          message: "Unable to fetch the address.",
          data: { extra: err.message }
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
          message: "Unable to create the address.",
          data: { extra: err.message }
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
          message: "Unable to update the address.",
          data: { extra: err.message }
        });
      }
    },
    deleteAddress: async function(root, { id }, ctx) {
      const { addressRepository } = ctx;
      try {
        await addressRepository.delete(id);
        return true;
      } catch (err) {
        throw new DeleteError({
          message: "Unable to delete the address.",
          data: { extra: err.message }
        });
      }
    }
  }
};

module.exports = resolvers;
