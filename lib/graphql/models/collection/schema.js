module.exports = [
  `
  type Collection {
      # SQL id of this collection
      id: Int!,

      # Name of this collection
      name: String!

      # User who created this collection
      owner_id: Int,

      # Description of this collection
      description: String,

      # JSON encoded tags array for this collection
      tags: String,

      # Timestamp when this collection was created
      created_at: DateTime!,

      # Timestamp when this collection was updated
      updated_at: DateTime,

      # Timestamp when this collection was deleted
      deleted_at: DateTime
  }

  input InputCreateCollection {
    # Name of this collection
    name: String!

    # User who created this collection
    owner_id: Int,

    # Description of this collection
    description: String,

    # JSON encoded tags array for this collection
    tags: String
  }

  input InputUpdateCollection {
    # Name of this collection
    name: String!

    # Description of this collection
    description: String,

    # JSON encoded tags array for this collection
    tags: String
  }
`
];
