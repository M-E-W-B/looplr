const { makeExecutableSchema } = require("graphql-tools");
const merge = require("lodash/merge");

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require("graphql-iso-date");

const {
  schema: UserSchema,
  resolvers: userResolvers
} = require("./models/user");

const {
  schema: CollectionSchema,
  resolvers: collectionResolvers
} = require("./models/collection");

const {
  schema: ProductSchema,
  resolvers: productResolvers
} = require("./models/product");

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
    getUsers: [User]

    getUserById(id: Int!): User!

    getCollections: [Collection]

    getCollectionById(id: Int!): Collection!

    getProducts: [Product]

    getProductById(id: Int!): Product!
  }

  type Mutation {
    createUser(fields: InputCreateUser!): User!

    updateUser(id: Int!, fields: InputUpdateUser!): User!

    deleteUser(id: Int!): Boolean!

    createCollection(fields: InputCreateCollection!): Collection!

    updateCollection(id: Int!, fields: InputUpdateCollection!): Collection!

    deleteCollection(id: Int!): Boolean!

    createProduct(fields: InputCreateProduct!): Product!

    updateProduct(id: Int!, fields: InputUpdateProduct!): Product!

    deleteProduct(id: Int!): Boolean!
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
  ...UserSchema,
  ...CollectionSchema
];

const resolvers = merge(rootResolvers, userResolvers, collectionResolvers);

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
});
