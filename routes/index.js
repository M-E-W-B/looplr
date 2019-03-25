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
const AddressRepositoryFactory = require('../models/address');
const badgeRepositoryFactory = require('../models/badge');
const colorRepositoryFactory = require('../models/color');
const commentRepositoryFactory = require('../models/comment');
const collectionRepositoryFactory = require('../models/collection');
const productRepositoryFactory = require('../models/product');
const sizeRepositoryFactory = require('../models/size');
const skuRepositoryFactory = require('../models/sku');
const couponRepositoryFactory = require('../models/coupon');
const userRepositoryFactory = require('../models/user');
const imageRepositoryFactory = require('../models/image');

module.exports = knexClient => {
  const addressRepository = AddressRepositoryFactory(knexClient);
  const badgeRepository = badgeRepositoryFactory(knexClient);
  const colorRepository = colorRepositoryFactory(knexClient);
  const commentRepository = commentRepositoryFactory(knexClient);
  const collectionRepository = collectionRepositoryFactory(knexClient);
  const productRepository = productRepositoryFactory(knexClient);
  const sizeRepository = sizeRepositoryFactory(knexClient);
  const skuRepository = skuRepositoryFactory(knexClient);
  const couponRepository = couponRepositoryFactory(knexClient);
  const userRepository = userRepositoryFactory(knexClient);
  const imageRepository = imageRepositoryFactory(knexClient);

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
