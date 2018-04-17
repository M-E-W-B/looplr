const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { formatError } = require("apollo-errors");
const schema = require("./executable-schema");
const UserRepositoryFactory = require("../graphql/models/user/repository");

const sampleQuery = `
  query user_query {
    getUsers {
      id
      first_name
      last_name
      gender
      reset_password_token
      created_at
    }

    getUserById(id: 1) {
      id
      first_name
      last_name
      gender
      reset_password_token
      created_at
    }
  }

  mutation user_create_mutation {
    createUser(fields: { first_name: "Charilie", last_name: "Kaufmann", email: "charlie@hotmail.com", password: "google", handle: "beingcharlie", gender: M, phonenumber: "9999888877" }) {
      id
      first_name
      last_name
      email
      handle
      gender
      phonenumber
      about
      is_active
      reset_password_token
      reset_password_expires_at
      created_at
      updated_at
    }
  }

  mutation user_update_mutation {
    updateUser(id: 12, fields: { gender: F, phonenumber: "8899888877" }) {
      id
      first_name
      last_name
      email
      handle
      gender
      phonenumber
      about
      is_active
      reset_password_token
      reset_password_expires_at
      created_at
      updated_at
    }
  }
`;

module.exports = (app, knexClient) => {
  const userRepository = UserRepositoryFactory(knexClient);

  app.use(
    "/graphql",
    graphqlExpress({
      formatError,
      schema,
      context: {
        userRepository
      }
    })
  );

  app.use(
    "/graphiql",
    graphiqlExpress({ endpointURL: "/graphql", query: sampleQuery })
  );
};
