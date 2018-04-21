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

    # List all addresses (by user id)
    addresses(user_id: Int): [Address]

    # Get address by id
    address(id: Int!): Address!

    # List all badges
    badges: [Badge]

    # Get badge by id
    badge(id: Int!): Badge!

    # List all collections (by user id)
    collections(user_id: Int): [Collection]

    # Get collection by id
    collection(id: Int!): Collection!

    # List all colors
    colors: [Color]

    # Get color by id
    color(id: Int!): Color!

    # List all comments (by user id, entity_id)
    comments(user_id: Int, entity_id: Int): [Comment]

    # Get comment by id
    comment(id: Int!): Comment!

    # List all coupons
    coupons: [Coupon]

    # Get coupon by id
    coupon(id: Int!): Coupon!

    # List all images (by entity id)
    images(entity_id: Int): [Image]

    # Get image by id
    image(id: Int!): Image!

    # List all products (by collection id)
    products(collection_id: Int): [Product]

    # Get product by id
    product(id: Int!): Product!

    # List all sizes
    sizes: [Size]

    # Get size by id
    size(id: Int!): Size!

    # List all skus (by product id)
    skus(product_id: Int): [Sku]

    # Get sku by id
    sku(id: Int!): Sku!

    # List all inactive skus
    inactiveSkus: [Sku]

    # List all users
    users: [User]

    # Get user by id
    user(id: Int!): User!

    # List all followers of a user
    followers(user_id: Int!): [User]

    # List all users whom a user is following
    followings(user_id: Int!): [User]
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
