const router = require('express').Router();
const pick = require('lodash/pick');

module.exports = ({ commentRepository }) => {
  router.post('/', async (req, res, next) => {
    const fields = pick(req.body, ['user_id', 'entity_id', 'rating', 'txt']);

    try {
      const [id] = await commentRepository.create(fields);
      const comment = await commentRepository.getCommentById(id);
      return res.json(comment);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the comment.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      await commentRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
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
      next(
        new Error({
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
      next(
        new Error({
          message: 'Unable to fetch the comment.',
          data: { extra: err.message }
        })
      );
    }

    if (comment) return res.json(comment);
    else
      next(
        new Error({
          message: 'Comment not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      const edges = await commentRepository.getComments(
        pagination,
        orderings,
        filters
      );

      const pageInfo = commentRepository.getPageInfo(
        pagination,
        orderings,
        filters
      );

      return res.json({ edges, pageInfo });

      return res.json(comments);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch comments.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
