const router = require('express').Router();
const Error = require('../utils/errors');

module.exports = (
  { userRepository, badgeRepository, collectionRepository, commentRepository },
  { verify }
) => {
  router.delete('/', async (req, res, next) => {
    const { id } = req.decoded;

    try {
      await userRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to delete the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.put('/', verify, async (req, res, next) => {
    const { id } = req.decoded;

    try {
      await userRepository.update(id, req.body);
      const user = await userRepository.getUserById(id);
      return res.json(user);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to update the user.',
          data: { extra: err.message }
        })
      );
    }
  });

  // router.get('/list', async (req, res, next) => {
  //   const { pagination, orderings, filters } = decode(req.query.q);

  //   try {
  //     const edges = await userRepository.getUsers(
  //       pagination,
  //       orderings,
  //       filters
  //     );

  //     const pageInfo = await userRepository.getPageInfo(
  //       pagination,
  //       orderings,
  //       filters
  //     );

  //     return res.json({
  //       edges,
  //       pageInfo
  //     });
  //   } catch (err) {
  //     return next(
  //       new Error.BadRequestError({
  //         message: 'Unable to fetch users.',
  //         data: { extra: err.message }
  //       })
  //     );
  //   }
  // });

  router.get('/', verify, async (req, res, next) => {
    let user;
    const { id } = req.decoded;

    try {
      user = await userRepository.getUserById(id);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the user.',
          data: { extra: err.message }
        })
      );
    }

    if (user) return res.json(user);
    else
      return next(
        new Error.BadRequestError({
          message: 'User not found.'
        })
      );
  });

  router.post('/follow/:id', verify, async (req, res, next) => {
    const { id: toFollowUserId } = req.params;
    const { id } = req.decoded;

    try {
      await userRepository.followUser(id, toFollowUserId);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          data: { extra: err.message }
        })
      );
    }
  });

  router.post('/unfollow/:id', verify, async (req, res, next) => {
    const { id: toUnfollowUserId } = req.params;
    const { id } = req.decoded;

    try {
      await userRepository.unfollowUser(id, toUnfollowUserId);
      return res.status(200).end();
    } catch (err) {
      return next(
        new Error.BadRequestError({
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/followings', verify, async (req, res, next) => {
    const { id } = req.decoded;

    try {
      const users = await userRepository.getFollowings(id);
      return res.json(users);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the users.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/followers', verify, async (req, res, next) => {
    const { id } = req.decoded;

    try {
      const users = await userRepository.getFollowers(id);
      return res.json(users);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch the users.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/wishlist/list', verify, async (req, res, next) => {
    try {
      const wishlist = await wishlistRepository.getWishlistByUserId(
        req.decoded.id
      );
      return res.json(wishlist);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch wishlist.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/badge/list', verify, async (req, res, next) => {
    try {
      const badges = await badgeRepository.getBadgesByUserId(req.decoded.id);
      return res.json(badges);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch badges.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.get('/collection/list', verify, async (req, res, next) => {
    const pagination = null;
    const orderings = null;
    const filters = [
      {
        column: 'owner_id',
        value: [req.decoded.id],
        operator: 'EQUAL'
      }
    ];

    try {
      const collections = await collectionRepository.getCollections(
        pagination,
        orderings,
        filters
      );

      return res.json(collections);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to fetch collections.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.post('/collection', verify, async (req, res, next) => {
    req.body.ownerId = req.decoded.id;

    try {
      const id = await collectionRepository.create(req.body);
      const collection = await collectionRepository.getCollectionById(id);

      return res.json(collection);
    } catch (err) {
      return next(
        new Error.BadRequestError({
          message: 'Unable to create the collection.',
          data: { extra: err.message }
        })
      );
    }
  });

  router.delete('/collection/:id', verify, async (req, res, next) => {
    const { id } = req.params;
    const collection = await collectionRepository.getCollectionById(id);

    if (collection.ownerId === req.decoded.id)
      try {
        await collectionRepository.delete(id);
        return res.status(200).end();
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to delete the collection.',
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

  router.put('/collection/:id', verify, async (req, res, next) => {
    const { id } = req.params;
    const collection = await collectionRepository.getCollectionById(id);

    if (collection.ownerId === req.decoded.id)
      try {
        await collectionRepository.update(id, req.body);
        const collection = await collectionRepository.getCollectionById(id);

        return res.json(collection);
      } catch (err) {
        return next(
          new Error.BadRequestError({
            message: 'Unable to update the collection.',
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

  router.put(
    '/collection/:collectionId/add-product/:productId',
    verify,
    async (req, res, next) => {
      const { collectionId, productId } = req.params;
      const collection = await collectionRepository.getCollectionById(
        collectionId
      );

      if (collection.ownerId === req.decoded.id)
        try {
          await collectionRepository.addProductIntoCollection(
            collectionId,
            productId
          );
          return res.stautus(200).end();
        } catch (err) {
          return next(
            new Error.BadRequestError({
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
    }
  );

  router.put(
    '/collection/:collectionId/remove-product/:productId',
    verify,
    async (req, res, next) => {
      const { collectionId, productId } = req.params;
      const collection = await collectionRepository.getCollectionById(
        collectionId
      );

      if (collection.ownerId === req.decoded.id)
        try {
          await collectionRepository.removeProductFromCollection(
            collection_id,
            product_id
          );
          return res.status(200).end();
        } catch (err) {
          return next(
            new Error.BadRequestError({
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
    }
  );

  // list comments on collection, product, order
  router.get(
    '/comment/list/entity/:entityId',
    verify,
    async (req, res, next) => {
      const pagination = null;
      const orderings = null;
      const filter = [
        {
          column: 'entity_id',
          value: [req.params.entityId],
          operator: 'EQUAL'
        },
        {
          column: 'user_id',
          value: [req.decoded.id],
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
    }
  );

  return router;
};
