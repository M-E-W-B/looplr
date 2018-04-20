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
    getCollectionsByUserId(user_id: Int!): [Collection]

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

    # List all products within a collection
    getProductsByCollectionId(collection_id: Int!): [Product]

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

    # List all followers of a user
    getFollowers(user_id: Int!): [User]

    # List all users whom a user is following
    getFollowings(user_id: Int!): [User]
  }

  type Mutation {

    # Create an address
    createAddress(fields: InputCreateAddress!): Address!

    # Modify an address
    updateAddress(id: Int!, fields: InputUpdateAddress!): Address!

    # Delete an address
    deleteAddress(id: Int!): Boolean!

    # Create a badge
    createBadge(fields: InputCreateBadge!): Badge!

    # Modify a badge
    updateBadge(id: Int!, fields: InputUpdateBadge!): Badge!

    # Delete a badge
    deleteBadge(id: Int!): Boolean!

    # Create a collection
    createCollection(fields: InputCreateCollection!): Collection!

    # Modify a collection
    updateCollection(id: Int!, fields: InputUpdateCollection!): Collection!

    # Add a product into a collection
    addProductIntoCollection(collection_id: Int!, product_id: Int!): Boolean!

    # Remove a product from a collection
    removeProductFromCollection(collection_id: Int!, product_id: Int!): Boolean!

    # Delete a collection
    deleteCollection(id: Int!): Boolean!

    # Create a color
    createColor(fields: InputCreateColor!): Color!

    # Update a color
    updateColor(id: Int!, fields: InputUpdateColor!): Color!

    # Delete a color
    deleteColor(id: Int!): Boolean!

    # Create a comment
    createComment(fields: InputCreateComment!): Comment!

    # Update a comment
    updateComment(id: Int!, fields: InputUpdateComment!): Comment!

    # Delete a comment
    deleteComment(id: Int!): Boolean!

    # Create a coupon
    createCoupon(fields: InputCreateCoupon!): Coupon!

    # Update a coupon
    updateCoupon(id: Int!, fields: InputUpdateCoupon!): Coupon!

    # Delete a coupon
    deleteCoupon(id: Int!): Boolean!

    # Create an image
    createImage(fields: InputCreateImage!): Image!

    # Update an image
    updateImage(id: Int!, fields: InputUpdateImage!): Image!

    # Delete an image
    deleteImage(id: Int!): Boolean!

    # Create a product
    createProduct(fields: InputCreateProduct!): Product!

    # Update a product
    updateProduct(id: Int!, fields: InputUpdateProduct!): Product!

    # Delete a product
    deleteProduct(id: Int!): Boolean!

    # Create a size
    createSize(fields: InputCreateSize!): Size!

    # Update a size
    updateSize(id: Int!, fields: InputUpdateSize!): Size!

    # Delete a size
    deleteSize(id: Int!): Boolean!

    # Create an sku
    createSku(fields: InputCreateSku!): Sku!

    # Update an sku
    updateSku(id: Int!, fields: InputUpdateSku!): Sku!

    # Delete an sku
    deleteSku(id: Int!): Boolean!

    # Create a user
    createUser(fields: InputCreateUser!): User!

    # Update a user
    updateUser(id: Int!, fields: InputUpdateUser!): User!

    # Delete a user
    deleteUser(id: Int!): Boolean!

    # Follow a user
    followUser(user_id: Int!, to_follow_user_id: Int!): Boolean!

    # Unfollow a user
    unfollowUser(user_id: Int!, to_unfollow_user_id: Int!): Boolean!
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
