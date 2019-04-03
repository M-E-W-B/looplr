const router = require('express').Router();

// config layout
const { layout } = require('../config.json');

// routers
const authRouter = require('./auth');
const addressRouter = require('./address');
const badgeRouter = require('./badge');
const colorRouter = require('./color');
const commentRouter = require('./comment');
const collectionRouter = require('./collection');
const wishlistRouter = require('./wishlist');
const categoryRouter = require('./category');
const productRouter = require('./product');
const sizeRouter = require('./size');
const skuRouter = require('./sku');
const couponRouter = require('./coupon');
const userRouter = require('./user');

// repositories
const {
  AddressRepositoryFactory,
  BadgeRepositoryFactory,
  ColorRepositoryFactory,
  CommentRepositoryFactory,
  CategoryRepositoryFactory,
  WishlistRepositoryFactory,
  CollectionRepositoryFactory,
  ProductRepositoryFactory,
  SizeRepositoryFactory,
  SkuRepositoryFactory,
  CouponRepositoryFactory,
  UserRepositoryFactory
} = require('../models');

module.exports = (knexClient, middlewares) => {
  const addressRepository = AddressRepositoryFactory(knexClient);
  const badgeRepository = BadgeRepositoryFactory(knexClient);
  const colorRepository = ColorRepositoryFactory(knexClient);
  const commentRepository = CommentRepositoryFactory(knexClient);
  const categoryRepository = CategoryRepositoryFactory(knexClient);
  const wishlistRepository = WishlistRepositoryFactory(knexClient);
  const collectionRepository = CollectionRepositoryFactory(knexClient);
  const productRepository = ProductRepositoryFactory(knexClient);
  const sizeRepository = SizeRepositoryFactory(knexClient);
  const skuRepository = SkuRepositoryFactory(knexClient);
  const couponRepository = CouponRepositoryFactory(knexClient);
  const userRepository = UserRepositoryFactory(knexClient);

  const ctx = {
    addressRepository,
    badgeRepository,
    categoryRepository,
    colorRepository,
    commentRepository,
    collectionRepository,
    wishlistRepository,
    productRepository,
    sizeRepository,
    skuRepository,
    couponRepository,
    userRepository
  };

  router.get('/layout', (req, res, next) => {
    res.json(layout);
  });

  router.use('/', authRouter(ctx));
  router.use('/address', addressRouter(ctx, middlewares));
  router.use('/badge', badgeRouter(ctx, middlewares));
  router.use('/color', colorRouter(ctx, middlewares));
  router.use('/comment', commentRouter(ctx, middlewares));
  router.use('/category', categoryRouter(ctx, middlewares));
  router.use('/collection', collectionRouter(ctx, middlewares));
  router.use('/wishlist', wishlistRouter(ctx, middlewares));
  router.use('/product', productRouter(ctx, middlewares));
  router.use('/size', sizeRouter(ctx, middlewares));
  router.use('/sku', skuRouter(ctx, middlewares));
  router.use('/coupon', couponRouter(ctx, middlewares));
  router.use('/user', userRouter(ctx, middlewares));

  return router;
};
