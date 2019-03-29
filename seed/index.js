const faker = require('faker');
const knexClient = require('../knex-client');
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

const enums = {
  genders: ['M', 'F'],
  addressType: ['home', 'office', 'other'],
  imageType: ['product', 'collection', 'product_sizechart', 'user'],
  boolean: [0, 1]
};

const randomizeArray = faker.helpers.randomize;

const toTimestamp = date => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${year}:${month}:${day} ${hour}:${minute}:${second}`;
};

async function init() {
  // User
  const userIds = await Promise.all(
    [...Array(500)].map(async () => {
      try {
        return await userRepository.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          handle: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          gender: randomizeArray(enums.genders),
          phonenumber: faker.random.number({
            min: 8000000000,
            max: 9999999999
          }),
          about: faker.random.words(),
          isActive:
            enums.boolean[Math.floor(Math.random() * enums.boolean.length)]
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Address
  const addressIds = await Promise.all(
    [...Array(500)].map(async () => {
      try {
        return await addressRepository.create({
          userId: randomizeArray(userIds),
          streetAddress: faker.address.streetAddress(),
          landmark: faker.address.streetName(),
          city: faker.address.city(),
          state: faker.address.state(),
          postalCode: faker.random.number({ min: 100000, max: 999999 }),
          type: randomizeArray(enums.addressType)
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Badge
  const badgeIds = await Promise.all(
    [...Array(100)].map(async () => {
      try {
        return await badgeRepository.create({
          name: faker.random.word(),
          description: faker.random.words()
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Collection
  const collectionIds = await Promise.all(
    [...Array(500)].map(async () => {
      try {
        return await collectionRepository.create({
          name: faker.random.words(),
          ownerId: randomizeArray(userIds),
          description: faker.lorem.sentences(),
          tags: JSON.stringify(faker.random.words().split(' '))
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Color
  const colorIds = await Promise.all(
    [...Array(100)].map(async () => {
      try {
        return await colorRepository.create({
          hexcode: faker.internet.color()
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Product
  const productIds = await Promise.all(
    [...Array(500)].map(async () => {
      try {
        return await productRepository.create({
          name: faker.random.word(),
          category: faker.random.word(),
          subcategory: faker.random.word(),
          description: faker.lorem.sentences(),
          storename: faker.random.word(),
          gender: randomizeArray(enums.genders.concat('U')),
          tags: JSON.stringify(faker.random.words().split(' ')),
          promotionalText: faker.lorem.sentences()
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Comment
  const commentIds = await Promise.all(
    [...Array(100)].map(async () => {
      try {
        return await commentRepository.create({
          userId: randomizeArray(userIds),
          entityId: randomizeArray(collectionIds.concat(productIds)),
          rating: faker.random.number({ min: 0, max: 10 }),
          txt: faker.random.words()
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Coupon
  const couponIds = await Promise.all(
    [...Array(50)].map(async () => {
      try {
        await couponRepository.create({
          code:
            faker.commerce
              .productAdjective()
              .toUpperCase()
              .substring(0, 4) + faker.random.number({ min: 999, max: 9999 }),
          description: faker.lorem.sentences(),
          maxUses: faker.random.number({ min: 100 }),
          maxUsesPerUser: faker.random.number({ min: 1, max: 100 }),
          minOrder: faker.random.number({ min: 1000, max: 5000 }),
          isPercentage: 1,
          discount: faker.random.number({ min: 100, max: 500 }),
          startsAt: toTimestamp(faker.date.past()),
          expiresAt: toTimestamp(faker.date.past())
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Image
  const imageIds = await Promise.all(
    [...Array(100)].map(async () => {
      try {
        return await imageRepository.create({
          entityId: randomizeArray(collectionIds.concat(productIds)),
          type: randomizeArray(enums.imageType),
          url: 'http://lorempixel.com/100/100/',
          thumbnailUrl: 'http://lorempixel.com/20/20/',
          description: faker.lorem.sentence()
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Size
  const sizeIds = await Promise.all(
    [...Array(30)].map(async () => {
      try {
        return await sizeRepository.create({
          name: faker.hacker.abbreviation()
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Sku
  const skuIds = await Promise.all(
    [...Array(200)].map(async () => {
      try {
        return await skuRepository.create({
          productId: randomizeArray(productIds),
          skuAttributeId: randomizeArray(colorIds.concat(sizeIds)),
          stock: faker.random.number({ min: 0, max: 30 }),
          price: faker.random.number({ min: 100, max: 1000 }),
          discount: faker.random.number({ min: 100, max: 1000 }),
          isActive: randomizeArray(enums.boolean)
        });
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Add Products to Collections
  await Promise.all(
    [...Array(200)].map(async () => {
      try {
        return await collectionRepository.addProductIntoCollection(
          randomizeArray(collectionIds),
          randomizeArray(productIds)
        );
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );

  // Follow
  await Promise.all(
    [...Array(100)].map(async () => {
      try {
        return await userRepository.followUser(
          randomizeArray(userIds),
          randomizeArray(userIds)
        );
      } catch (error) {
        console.log(error.sqlMessage);
        console.log(error.sql);
      }
    })
  );
}

init();
