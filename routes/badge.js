const router = require('express').Router();
const Error = require('../utils/errors');

module.exports = ({ badgeRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    if (req.decoded.isAdmin)
      try {
        const id = await badgeRepository.create(req.body);
        const badge = await badgeRepository.getBadgeById(id);
        return res.json(badge);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to create the badge.',
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
        await badgeRepository.delete(id);
        return res.status(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to delete the badge.',
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
        await badgeRepository.update(id, req.body);
        const badge = await badgeRepository.getBadgeById(id);
        return res.json(badge);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to update the badge.',
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

  // { id, name, description, created_at, updated_at, deleted_at }
  // router.get('/:id', async (req, res, next) => {
  //   const { id } = req.params;
  //   let badge;

  //   try {
  //     badge = await badgeRepository.getBadgeById(id);
  //   } catch (err) {
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Unable to fetch the badge.',
  //         data: { extra: err.message }
  //       })
  //     );
  //   }

  //   if (badge) return res.json(badge);
  //   else
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Badge not found.',
  //         data: { extra: err.message }
  //       })
  //     );
  // });

  //  list all badges
  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await badgeRepository.getBadges(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await badgeRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch badges.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
