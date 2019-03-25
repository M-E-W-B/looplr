const router = require('express').Router();

module.exports = ctx => {
  // { user_id, entity_id, rating, txt }
  router.post('/', async (req, res, next) => {
    const { commentRepository } = ctx;

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
    const { commentRepository } = ctx;
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
    const { commentRepository } = ctx;
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
    const { commentRepository } = ctx;
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
    const { commentRepository } = ctx;

    try {
      let comments;

      // @TODO
      if (user_id)
        comments = await commentRepository.getCommentsByUserId(user_id);
      if (entity_id)
        comments = await commentRepository.getCommentsOn(entity_id);
      else comments = await commentRepository.getComments();

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
