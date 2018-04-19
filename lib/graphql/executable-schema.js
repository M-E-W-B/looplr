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

    # List all addresses
    getAddresses: [Address]

    # Get address by id
    getAddressById(id: Int!): Address!

    # List all addresses of a user
    getAddressesByUserId(user_id: Int!): [Address]

    # List all badges
    getBadges: [Badge]

    # Get badge by id
    getBadgeById(id: Int!): Badge!

    # List all collections
    getCollections: [Collection]

    # Get collection by id
    getCollectionById(id: Int!): Collection!

    # List all collections of a user
    getCollectionesByUserId(user_id: Int!): [Collection]

    # List all colors
    getColors: [Color]

    # Get color by id
    getColorById(id: Int!): Color!

    # List all comments
    getComments: [Comment]

    # Get comment by id
    getCommentById(id: Int!): Comment!

    # List all comments of a user
    getCommentsByUserId(user_id: Int!): [Comment]

    # List all comments of on an entity
    getCommentsOn(entity_id: Int!): [Comment]

    # List all coupons
    getCoupons: [Coupon]

    # Get coupon by id
    getCouponById(id: Int!): Coupon!

    # List all images
    getImages: [Image]

    # Get image by id
    getImageById(id: Int!): Image!

    # List all images of on an entity
    getImagesOn(entity_id: Int!): [Image]

    # List all products
    getProducts: [Product]

    # Get product by id
    getProductById(id: Int!): Product!

    # List all sizes
    getSizes: [Size]

    # Get size by id
    getSizeById(id: Int!): Size!

    # List all skus
    getSkus: [Sku]

    # Get sku by id
    getSkuById(id: Int!): Sku!

    # List all skus of a product
    getSkusByProductId(product_id: Int!): [Sku]

    # List all inactive skus
    getInactiveSkus: [Sku]

    # List all users
    getUsers: [User]

    # Get user by id
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
