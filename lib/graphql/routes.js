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
{
  addresses(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
      user {
        id
      }
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  address(id: 1) {
    id
  }
  badges(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  badge(id: 1) {
    id
  }
  collections(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
      products {
        edges {
          id
          skus {
            edges {
              id
            }
          }
        }
      }
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  collection(id: 3) {
    id
  }
  colors(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  color(id: 1) {
    id
  }
  comments(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  images(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  image(id: 1) {
    id
  }
  products(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
      storename
      skus {
        edges {
          id
          sku_attribute_id
          discount
          color {
            hexcode
          }
          size {
            name
          }
        }
      }
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }  
  product(id: 5) {
    id
  }
  sizes(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  size(id: 3) {
    id
  }
  skus(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
      color {
        id
      }
      size {
        id
      }
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  sku(id: 1) {
    id
  }
  users(pagination: {pageSize: 10, pageNumber: 1}) {
    edges {
      id
    }
    pageInfo {
      totalPages
      hasPreviousPage
      hasNextPage
      totalCount
    }
  }
  user(id: 1) {
    id
  }
}
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
