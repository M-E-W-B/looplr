const router = require('express').Router();
const Error = require('../utils/errors');
const decode = require('../utils/decode');

module.exports = ({ addressRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    req.body.userId = req.decoded.id;

    try {
      const [id] = await addressRepository.create(req.body);
      const address = await addressRepository.getAddressById(id);
      return res.json(address);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the address.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', verify, async (req, res, next) => {
    const { id } = req.params;
    const address = await addressRepository.getAddressById(id);

    // user should only be able to delete their own address
    if (address.userId === req.decoded.id)
      try {
        await addressRepository.delete(id);
        return res.status(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to delete the address.',
            data: { extra: err.message }
          })
        );
      }
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation.",
          data: { extra: err.message }
        })
      );
  });

  router.put('/:id', verify, async (req, res, next) => {
    const { id } = req.params;
    const address = await addressRepository.getAddressById(id);

    // user should only be able to update their own address
    if (address.userId === req.decoded.id)
      try {
        await addressRepository.update(id, req.body);
        const address = await addressRepository.getAddressById(id);
        return res.json(address);
      } catch (err) {
        throw new Error.BadRequestError({
          message: 'Unable to update the address.',
          data: { extra: err.message }
        });
      }
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation.",
          data: { extra: err.message }
        })
      );
  });

  router.get('/list', verify, async (req, res, next) => {
    const pagination = null;
    const orderings = null;
    const filters = [
      {
        column: 'user_id',
        value: [req.decoded.id],
        operator: 'EQUAL'
      }
    ];

    try {
      const addresses = await addressRepository.getAddresses(
        pagination,
        orderings,
        filters
      );

      return res.json(addresses);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch addresses.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/:id', verify, async (req, res, next) => {
    // @TODO: only his own address a user can get
    const { id } = req.params;
    let address;

    try {
      address = await addressRepository.getAddressById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the address.',
          data: { extra: err.message }
        })
      );
    }

    if (address) {
      if (address.userId === req.decoded.id) return res.json(address);
      else
        return next(
          new Error.AuthenticationError({
            message: "You don't have access to perform this operation.",
            data: { extra: err.message }
          })
        );
    } else
      return next(
        new Error.BadRequestError({
          message: 'Address not found.',
          data: { extra: err.message }
        })
      );
  });

  return router;
};
