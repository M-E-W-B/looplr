const { makeExecutableSchema } = require("graphql-tools");
const merge = require("lodash/merge");

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

const {
  schema: CommonSchema,
  resolvers: commonResolvers
} = require("./models/common");

const RootSchema = [
  `
  type Query {

    # List all addresses paginated
    addresses(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): AddressConnection!

    # Get address by id
    address(id: Int!): Address!

    # List all badges paginated
    badges(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): BadgeConnection!

    # Get badge by id
    badge(id: Int!): Badge!

    # List all collections paginated
    collections(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): CollectionConnection!

    # Get collection by id
    collection(id: Int!): Collection!

    # List all colors paginated
    colors(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): ColorConnection!

    # Get color by id
    color(id: Int!): Color

    # List all comments paginated
    comments(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): CommentConnection!

    # Get comment by id
    comment(id: Int!): Comment!

    # List all coupons paginated
    coupons(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): CouponConnection!

    # Get coupon by id
    coupon(id: Int!): Coupon!

    # List all images paginated
    images(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): ImageConnection!

    # Get image by id
    image(id: Int!): Image!

    # List all products paginated
    products(
      collection_id: Int,
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): ProductConnection!

    # Get product by id
    product(id: Int!): Product!

    # List all sizes paginated
    sizes(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): SizeConnection!

    # Get size by id
    size(id: Int!): Size

    # List all skus
    # Filter inactiveSkus, by product_id
    skus(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): SkuConnection!

    # Get sku by id
    sku(id: Int!): Sku!

    # List all users
    users(
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): UserConnection!

    # Get user by id
    user(id: Int!): User!

    # List all followers of a user
    followers(
      user_id: Int!,
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): UserConnection!

    # List all users whom a user is following
    followings(
      user_id: Int!,
      pagination: PaginationArgs,
      orderings: [OrderingArgs],
      filters: [FilterArgs]
    ): UserConnection!
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
  commonResolvers,
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
