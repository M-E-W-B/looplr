const router = require('express').Router();

module.exports = ctx => {
  // { user_id, street_address, landmark, city, state, postal_code }
  router.post('/', async (req, res, next) => {
    const { addressRepository } = ctx;

    try {
      const [id] = await addressRepository.create(fields);
      const address = await addressRepository.getAddressById(id);
      return res.json(address);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the address.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    const { addressRepository } = ctx;
    try {
      await addressRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the address.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { user_id, street_address, landmark, city, state, postal_code }
  router.put('/:id', async (req, res, next) => {
    const { addressRepository } = ctx;
    try {
      await addressRepository.update(id, fields);
      const address = await addressRepository.getAddressById(id);
      return res.json(address);
    } catch (err) {
      throw new Error({
        message: 'Unable to update the address.',
        data: { extra: err.message }
      });
    }
  });

  // { id, user_id, street_address, landmark, state, postal_code, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { addressRepository } = ctx;
    let address;

    try {
      address = await addressRepository.getAddressById(id);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the address.',
          data: { extra: err.message }
        })
      );
    }

    if (address) return res.json(address);
    else
      next(
        new Error({
          message: 'Address not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    const { addressRepository } = ctx;

    try {
      const edges = await addressRepository.getAddresses(
        pagination,
        orderings,
        filters
      );

      const pageInfo = addressRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({
        edges,
        pageInfo
      });
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch addresses.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
