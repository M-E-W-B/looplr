module.exports = [
  `
  type Address {
      # SQL id of this address
      id: Int!,

      # User who created this address
      user_id: Int!,

      # Street address of this address
      street_address: String!,

      # Landmark of this address
      landmark: String,

      # City of this address
      city: String!,

      # State of this address
      state: String!,

      # Pincode of this address
      postal_code: String!,

      # Timestamp when this address was created
      created_at: DateTime!,

      # Timestamp when this address was updated
      updated_at: DateTime,

      # Timestamp when this address was deleted
      deleted_at: DateTime
  }

  input InputCreateAddress {
    # User who created this address
    user_id: Int!,

    # Street address of this address
    street_address: String!,

    # Landmark of this address
    landmark: String,

    # City of this address
    city: String!,

    # State of this address
    state: String!,

    # Pincode of this address
    postal_code: String!
  }

  input InputUpdateAddress {
    # User who created this address
    user_id: Int!,

    # Street address of this address
    street_address: String!,

    # Landmark of this address
    landmark: String,

    # City of this address
    city: String!,

    # State of this address
    state: String!,

    # Pincode of this address
    postal_code: String!
  }
`
];
