const router = require('express').Router();
const pick = require('lodash/pick');
const Error = require('../utils/errors');

module.exports = ({ addressRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, [
      'user_id',
      'street_address',
      'landmark',
      'city',
      'state',
      'postal_code',
      'type'
    ]);

    try {
      const [id] = await addressRepository.create(fields);
      const address = await addressRepository.getAddressById(id);
      return res.json(address);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to create the address.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await addressRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to delete the address.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const fields = pick(req.body, [
      'user_id',
      'street_address',
      'landmark',
      'city',
      'state',
      'postal_code',
      'type'
    ]);

    try {
      await addressRepository.update(id, fields);
      const address = await addressRepository.getAddressById(id);
      return res.json(address);
    } catch (err) {
      throw new Error.BadRequestError({
        message: 'Unable to update the address.',
        data: { extra: err.message }
      });
    }
  });

  // { id, user_id, street_address, landmark, state, postal_code, type, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let address;

    try {
      address = await addressRepository.getAddressById(id);
    } catch (err) {
      next(
        new Error.BadRequestError({
          message: 'Unable to fetch the address.',
          data: { extra: err.message }
        })
      );
    }

    if (address) return res.json(address);
    else
      next(
        new Error.BadRequestError({
          message: 'Address not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
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
        new Error.BadRequestError({
          message: 'Unable to fetch addresses.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
