const router = require('express').Router();
const pick = require('lodash/pick');

const Error = require('../utils/errors');

module.exports = ({ commentRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, ['entity_id', 'rating', 'txt']);

    fields.user_id = req.decoded.id;

    try {
      const [id] = await commentRepository.create(fields);
      const comment = await commentRepository.getCommentById(id);
      return res.json(comment);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the comment.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await commentRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to delete the comment.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { rating, txt }
  router.put('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await commentRepository.update(id, fields);
      const comment = await commentRepository.getCommentById(id);
      return res.json(comment);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to update the comment.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, user_id, entity_id, rating, txt, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    let comment;

    try {
      comment = await commentRepository.getCommentById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the comment.',
          data: { extra: err.message }
        })
      );
    }

    if (comment) return res.json(comment);
    else
      return next(
        new Error.BadRequestError({
          message: 'Comment not found.',
          data: { extra: err.message }
        })
      );
  });

  router.post('/list', async (req, res, next) => {
    const { pagination, orderings, filters } = req.body;

    try {
      const edges = await commentRepository.getComments(
        pagination,
        orderings,
        filters
      );

      const pageInfo = await commentRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });

      return res.json(comments);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch comments.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
