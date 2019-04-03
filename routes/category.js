const router = require('express').Router();
const groupBy = require('lodash.groupBy');
const Error = require('../utils/errors');
const decode = require('../utils/decode');

module.exports = ({ categoryRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    if (req.decoded.isAdmin)
      try {
        const id = await categoryRepository.create(req.body);
        const category = await categoryRepository.getCategoryById(id);
        return res.json(category);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to create the category.',
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
        await categoryRepository.delete(id);
        return res.status(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to delete the category.',
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
        await categoryRepository.update(id, req.body);
        const category = await categoryRepository.getCategoryById(id);
        return res.json(category);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to update the category.',
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

  router.get('/list', async (req, res, next) => {
    try {
      const categories = await categoryRepository.getCategories();
      const groupedCategories = gropuBy(categories, 'parentCategoryId');

      return res.json(groupedCategories);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch categories.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, name, parent_category_id, created_at, updated_at, deleted_at }
  // router.get('/:id', async (req, res, next) => {
  //   const { id } = req.params;
  //   let category;

  //   try {
  //     category = await categoryRepository.getCategoryById(id);
  //   } catch (err) {
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Unable to fetch the category.',
  //         data: { extra: err.message }
  //       })
  //     );
  //   }

  //   if (category) return res.json(category);
  //   else
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'category not found.'
  //       })
  //     );
  // });

  return router;
};
