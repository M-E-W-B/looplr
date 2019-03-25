module.exports = [
  `
  type Size {
      # SQL id of this size
      id: Int!,

      # Name of this size
      name: String!

      # Timestamp when this size was created
      created_at: DateTime!,

      # Timestamp when this size was updated
      updated_at: DateTime,

      # Timestamp when this size was deleted
      deleted_at: DateTime
  }

  type SizeConnection {
    edges: [Size],
    pageInfo: PageInfo
  }

  input InputCreateSize {
    # Name of this size
    name: String!
  }

  input InputUpdateSize {
    # Name of this size
    name: String!
  }
`
];
