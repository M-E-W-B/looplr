const { makeExecutableSchema } = require("graphql-tools");
const merge = require("lodash/merge");

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require("graphql-iso-date");

const {
  schema: AddressSchema,
  resolvers: addressResolvers
} = require("./models/address");

const {
  schema: BadgeSchema,
  resolvers: badgeResolvers
} = require("./models/badge");

const {
  schema: CollectionSchema,
  resolvers: collectionResolvers
} = require("./models/collection");

const {
  schema: ColorSchema,
  resolvers: colorResolvers
} = require("./models/color");

const {
  schema: CommentSchema,
  resolvers: commentResolvers
} = require("./models/comment");

const {
  schema: CouponSchema,
  resolvers: couponResolvers
} = require("./models/coupon");

const {
  schema: ImageSchema,
  resolvers: imageResolvers
} = require("./models/image");

const {
  schema: ProductSchema,
  resolvers: productResolvers
} = require("./models/product");

const {
  schema: SizeSchema,
  resolvers: sizeResolvers
} = require("./models/size");

const { schema: SkuSchema, resolvers: skuResolvers } = require("./models/sku");

const {
  schema: UserSchema,
  resolvers: userResolvers
} = require("./models/user");

const { schema: CommonSchema } = require("./models/common");

const RootSchema = [
  `
  # An RFC 3339 compliant date-time scalar
  scalar DateTime

  # An RFC 3339 compliant date scalar
  scalar Date

  # An RFC 3339 compliant time scalar
  scalar Time

  type Query {
    getAddresses: [Address]

    getAddressById(id: Int!): Address!

    getBadges: [Badge]

    getBadgeById(id: Int!): Badge!

    getCollections: [Collection]

    getCollectionById(id: Int!): Collection!

    getColors: [Color]

    getColorById(id: Int!): Color!

    getComments: [Comment]

    getCommentById(id: Int!): Comment!

    getCoupons: [Coupon]

    getCouponById(id: Int!): Coupon!

    getImages: [Image]

    getImageById(id: Int!): Image!

    getProducts: [Product]

    getProductById(id: Int!): Product!

    getSizes: [Size]

    getSizeById(id: Int!): Size!

    getSkus: [Sku]

    getSkuById(id: Int!): Sku!

    getUsers: [User]

    getUserById(id: Int!): User!
  }

  type Mutation {
    createAddress(fields: InputCreateAddress!): Address!

    updateAddress(id: Int!, fields: InputUpdateAddress!): Address!

    deleteAddress(id: Int!): Boolean!

    createBadge(fields: InputCreateBadge!): Badge!

    updateBadge(id: Int!, fields: InputUpdateBadge!): Badge!

    deleteBadge(id: Int!): Boolean!

    createCollection(fields: InputCreateCollection!): Collection!

    updateCollection(id: Int!, fields: InputUpdateCollection!): Collection!

    deleteCollection(id: Int!): Boolean!

    createColor(fields: InputCreateColor!): Color!

    updateColor(id: Int!, fields: InputUpdateColor!): Color!

    deleteColor(id: Int!): Boolean!

    createComment(fields: InputCreateComment!): Comment!

    updateComment(id: Int!, fields: InputUpdateComment!): Comment!

    deleteComment(id: Int!): Boolean!

    createCoupon(fields: InputCreateCoupon!): Coupon!

    updateCoupon(id: Int!, fields: InputUpdateCoupon!): Coupon!

    deleteCoupon(id: Int!): Boolean!

    createImage(fields: InputCreateImage!): Image!

    updateImage(id: Int!, fields: InputUpdateImage!): Image!

    deleteImage(id: Int!): Boolean!

    createProduct(fields: InputCreateProduct!): Product!

    updateProduct(id: Int!, fields: InputUpdateProduct!): Product!

    deleteProduct(id: Int!): Boolean!

    createSize(fields: InputCreateSize!): Size!

    updateSize(id: Int!, fields: InputUpdateSize!): Size!

    deleteSize(id: Int!): Boolean!

    createSku(fields: InputCreateSku!): Sku!

    updateSku(id: Int!, fields: InputUpdateSku!): Sku!

    deleteSku(id: Int!): Boolean!

    createUser(fields: InputCreateUser!): User!

    updateUser(id: Int!, fields: InputUpdateUser!): User!

    deleteUser(id: Int!): Boolean!
  }
`
];

const rootResolvers = {
  DateTime: GraphQLDateTime,
  Date: GraphQLDate,
  Time: GraphQLTime
};

const typeDefs = [
  ...RootSchema,
  ...CommonSchema,
  ...AddressSchema,
  ...BadgeSchema,
  ...CollectionSchema,
  ...ColorSchema,
  ...CommentSchema,
  ...CouponSchema,
  ...ImageSchema,
  ...ProductSchema,
  ...SizeSchema,
  ...SkuSchema,
  ...UserSchema
];

const resolvers = merge(
  rootResolvers,
  addressResolvers,
  badgeResolvers,
  collectionResolvers,
  colorResolvers,
  commentResolvers,
  couponResolvers,
  imageResolvers,
  productResolvers,
  sizeResolvers,
  skuResolvers,
  userResolvers
);

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
