const router = require('express').Router();
const Error = require('../utils/errors');
const decode = require('../utils/decode');

module.exports = ({ colorRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    if (req.decoded.isAdmin)
      try {
        const id = await colorRepository.create(req.body);
        const color = await colorRepository.getColorById(id);
        return res.json(color);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to create the color.',
            data: { extra: err.message }
          })
        );
      }
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation."
        })
      );
  });

  router.delete('/:id', verify, async (req, res, next) => {
    const { id } = req.params;

    if (req.decoded.isAdmin)
      try {
        await colorRepository.delete(id);
        return res.status(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to delete the color.',
            data: { extra: err.message }
          })
        );
      }
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation."
        })
      );
  });

  router.put('/:id', verify, async (req, res, next) => {
    const { id } = req.params;

    if (req.decoded.isAdmin)
      try {
        await colorRepository.update(id, req.body);
        const color = await colorRepository.getColorById(id);
        return res.json(color);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to update the color.',
            data: { extra: err.message }
          })
        );
      }
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation."
        })
      );
  });

  router.get('/list', async (req, res, next) => {
    try {
      const colors = await colorRepository.getColors();
      return res.json(colors);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch colors.',
          data: { extra: err.message }
        })
      );
    }
  });

  // router.get('/:id', async (req, res, next) => {
  //   let color;
  //   const { id } = req.params;

  //   try {
  //     color = await colorRepository.getColorById(id);
  //   } catch (err) {
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Unable to fetch the color.',
  //         data: { extra: err.message }
  //       })
  //     );
  //   }

  //   if (color) return res.json(color);
  //   else
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Color not found.'
  //       })
  //     );
  // });

  return router;
};
