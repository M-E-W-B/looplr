const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { formatError } = require("apollo-errors");

const schema = require("./executable-schema");

const AddressRepositoryFactory = require("../graphql/models/address/repository");
const BadgeRepositoryFactory = require("../graphql/models/badge/repository");
const CollectionRepositoryFactory = require("../graphql/models/collection/repository");
const ColorRepositoryFactory = require("../graphql/models/color/repository");
const CommentRepositoryFactory = require("../graphql/models/comment/repository");
const CouponRepositoryFactory = require("../graphql/models/coupon/repository");
const ImageRepositoryFactory = require("../graphql/models/image/repository");
const ProductRepositoryFactory = require("../graphql/models/product/repository");
const SizeRepositoryFactory = require("../graphql/models/size/repository");
const SkuRepositoryFactory = require("../graphql/models/sku/repository");
const UserRepositoryFactory = require("../graphql/models/user/repository");

const sampleQuery = `
`;

module.exports = (app, knexClient) => {
  const addressRepository = AddressRepositoryFactory(knexClient);
  const badgeRepository = BadgeRepositoryFactory(knexClient);
  const collectionRepository = CollectionRepositoryFactory(knexClient);
  const colorRepository = ColorRepositoryFactory(knexClient);
  const commentRepository = CommentRepositoryFactory(knexClient);
  const couponRepository = CouponRepositoryFactory(knexClient);
  const imageRepository = ImageRepositoryFactory(knexClient);
  const productRepository = ProductRepositoryFactory(knexClient);
  const sizeRepository = SizeRepositoryFactory(knexClient);
  const skuRepository = SkuRepositoryFactory(knexClient);
  const userRepository = UserRepositoryFactory(knexClient);

  app.use(
    "/graphql",
    graphqlExpress({
      formatError,
      schema,
      context: {
        addressRepository,
        badgeRepository,
        collectionRepository,
        colorRepository,
        commentRepository,
        couponRepository,
        imageRepository,
        productRepository,
        sizeRepository,
        skuRepository,
        userRepository
      }
    })
  );

  app.use(
    "/graphiql",
    graphiqlExpress({ endpointURL: "/graphql", query: sampleQuery })
  );
};
