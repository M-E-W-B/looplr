module.exports = [
  `
  enum UserGender {
      M
      F
  }

  type User {
      # SQL id of this user
      id: Int!,

      # First name of this user
      first_name: String!

      # Last name of this user
      last_name: String,

      # Handle of this user
      handle: String,

      # Email of this user
      email: String!,

      # Gender of this user
      # M, F
      gender: UserGender,

      # Phonenumber of this user
      phonenumber: String,

      # About this user
      about: String,

      # Reset token for this user
      reset_password_token: String,

      # Reset token expiration for this user
      reset_password_expires_at: DateTime,

      # Whether this user is active or not
      is_active: Boolean,

      # Timestamp when this user was created
      created_at: DateTime!,

      # Timestamp when this user was updated
      updated_at: DateTime,

      # Timestamp when this user was deleted
      deleted_at: DateTime
  }

  input InputCreateUser {
    # First name given to this user
    first_name: String!

    # Last name given to this user
    last_name: String,

    # Handle given to this user
    handle: String,

    # Email given to this user
    email: String!,

    # Password given to this user
    password: String!,

    # Gender given to this user
    # M, F
    gender: Gender,

    # Phonenumber given to this user
    phonenumber: String,

    # About given to this user
    about: String,

    # Is active value for this user
    is_active: Boolean
  }

  input InputUpdateUser {
    # First name given to this user
    first_name: String

    # Last name given to this user
    last_name: String,

    # Gender given to this user
    # M, F
    gender: Gender,

    # Phonenumber given to this user
    phonenumber: String,

    # About given to this user
    about: String
  }
`
];
