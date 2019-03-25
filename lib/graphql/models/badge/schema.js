module.exports = [
  `
  type Badge {
      # SQL id of this badge
      id: Int!,

      # Name of this badge
      name: String!

      # Description of this badge
      description: String,

      # Timestamp when this badge was created
      created_at: DateTime!,

      # Timestamp when this badge was updated
      updated_at: DateTime,

      # Timestamp when this badge was deleted
      deleted_at: DateTime
  }

  type BadgeConnection {
    edges: [Badge],
    pageInfo: PageInfo
  }

  input InputCreateBadge {
    # Name of this badge
    name: String!

    # Description of this badge
    description: String
  }

  input InputUpdateBadge {
    # Name of this badge
    name: String!

    # Description of this badge
    description: String
  }
`
];
