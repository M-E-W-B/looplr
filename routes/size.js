const router = require('express').Router();
const Error = require('../utils/errors');

module.exports = ({ sizeRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    if (req.decoded.isAdmin)
      try {
        const id = await sizeRepository.create(req.body);
        const size = await sizeRepository.getSizeById(id);
        return res.json(size);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to create the size.',
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

  router.delete('/:id', verify, async (req, res, next) => {
    const { id } = req.params;

    if (req.decoded.isAdmin)
      try {
        await sizeRepository.delete(id);
        return res.status(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to delete the size.',
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

    if (req.decoded.isAdmin)
      try {
        await sizeRepository.update(id, req.body);
        const size = await sizeRepository.getSizeById(id);
        return res.json(size);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to update the size.',
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

  // { id, name, created_at, updated_at, deleted_at }
  // router.get('/:id', async (req, res, next) => {
  //   const { id } = req.params;
  //   let size;

  //   try {
  //     size = await sizeRepository.getSizeById(id);
  //   } catch (err) {
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Unable to fetch the size.',
  //         data: { extra: err.message }
  //       })
  //     );
  //   }

  //   if (size) return res.json(size);
  //   else
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Size not found.',
  //         data: { extra: err.message }
  //       })
  //     );
  // });

  router.post('/list', async (req, res, next) => {
    try {
      const sizes = await sizeRepository.getSizes();
      return res.json(sizes);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch sizes.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
