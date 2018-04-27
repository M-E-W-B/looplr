module.exports = [
  `
  type Comment {
      # SQL id of this comment
      id: Int!,

      # User who has written this comment
      user_id: Int!

      # Rating along with this comment
      rating: Int

      # Txt of this comment
      txt: String!,

      # Timestamp when this comment was created
      created_at: DateTime!,

      # Timestamp when this comment was updated
      updated_at: DateTime,

      # Timestamp when this comment was deleted
      deleted_at: DateTime
  }

  type CommentConnection {
    edges: [Comment],
    pageInfo: PageInfo
  }

  extend type Comment {
    # User for this comment
    user: User
  }

  input InputCreateComment {
    # User who has written this comment
    user_id: Int!

    # On what entity this comment has been written on
    entity_id: Int!

    # Rating along with this comment
    rating: Int

    # Txt of this comment
    txt: String!
  }

  input InputUpdateComment {
    # Rating along with this comment
    rating: Int

    # Txt of this comment
    txt: String!
  }
`
];
