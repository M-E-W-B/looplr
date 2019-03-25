const routes = require('express').Router();

// routers
const addressRouter = require('./address');
const badgeRouter = require('./badge');
const colorRouter = require('./color');
const commentRouter = require('./comment');
const collectionRouter = require('./collection');
const productRouter = require('./product');
const sizeRouter = require('./size');
const skuRouter = require('./sku');
const couponRouter = require('./coupon');
const userRouter = require('./user');
const imageRouter = require('./image');

// repositories
const {
  AddressRepositoryFactory,
  BadgeRepositoryFactory,
  ColorRepositoryFactory,
  CommentRepositoryFactory,
  CollectionRepositoryFactory,
  ProductRepositoryFactory,
  SizeRepositoryFactory,
  SkuRepositoryFactory,
  CouponRepositoryFactory,
  UserRepositoryFactory,
  ImageRepositoryFactory
} = require('../models');

module.exports = knexClient => {
  const addressRepository = AddressRepositoryFactory(knexClient);
  const badgeRepository = BadgeRepositoryFactory(knexClient);
  const colorRepository = ColorRepositoryFactory(knexClient);
  const commentRepository = CommentRepositoryFactory(knexClient);
  const collectionRepository = CollectionRepositoryFactory(knexClient);
  const productRepository = ProductRepositoryFactory(knexClient);
  const sizeRepository = SizeRepositoryFactory(knexClient);
  const skuRepository = SkuRepositoryFactory(knexClient);
  const couponRepository = CouponRepositoryFactory(knexClient);
  const userRepository = UserRepositoryFactory(knexClient);
  const imageRepository = ImageRepositoryFactory(knexClient);

  const ctx = {
    addressRepository,
    badgeRepository,
    colorRepository,
    commentRepository,
    collectionRepository,
    productRepository,
    sizeRepository,
    skuRepository,
    couponRepository,
    userRepository,
    imageRepository
  };

  router.use('/address', addressRouter(ctx));
  router.use('/badge', badgeRouter(ctx));
  router.use('/color', colorRouter(ctx));
  router.use('/comment', commentRouter(ctx));
  router.use('/collection', collectionRouter(ctx));
  router.use('/product', productRouter(ctx));
  router.use('/size', sizeRouter(ctx));
  router.use('/sku', skuRouter(ctx));
  router.use('/coupon', couponRouter(ctx));
  router.use('/user', userRouter(ctx));
  router.use('/image', imageRouter(ctx));

  return router;
};
