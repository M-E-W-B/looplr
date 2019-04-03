const router = require('express').Router();
const Error = require('../utils/errors');
const decode = require('../utils/decode');

module.exports = ({ commentRepository }, { verify }) => {
  router.post('/', verify, async (req, res, next) => {
    req.body.userId = req.decoded.id;

    try {
      const [id] = await commentRepository.create(req.body);
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

  router.delete('/:id', verify, async (req, res, next) => {
    const { id } = req.params;
    const comment = await commentRepository.getCommentById(id);

    if (comment.userId === req.decoded.id)
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
    const comment = await commentRepository.getCommentById(id);

    if (comment.userId === req.decoded.id)
      try {
        await commentRepository.update(id, req.body);
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
    else
      return next(
        new Error.AuthenticationError({
          message: "You don't have access to perform this operation.",
          data: { extra: err.message }
        })
      );
  });

  router.get('/list/entity/:entityId', async (req, res, next) => {
    const pagination = null;
    const orderings = null;
    const filter = [
      {
        column: 'entity_id',
        value: [req.params.entityId],
        operator: 'EQUAL'
      }
    ];

    try {
      const comments = await commentRepository.getComments(
        pagination,
        orderings,
        filters
      );
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

  // router.get('/:id', async (req, res, next) => {
  //   const { id } = req.params;
  //   let comment;

  //   try {
  //     comment = await commentRepository.getCommentById(id);
  //   } catch (err) {
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Unable to fetch the comment.',
  //         data: { extra: err.message }
  //       })
  //     );
  //   }

  //   if (comment) return res.json(comment);
  //   else
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Comment not found.',
  //         data: { extra: err.message }
  //       })
  //     );
  // });

  return router;
};
