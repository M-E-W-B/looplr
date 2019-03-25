module.exports = [
  `
  # An RFC 3339 compliant date-time scalar
  scalar DateTime

  # An RFC 3339 compliant date scalar
  scalar Date

  # An RFC 3339 compliant time scalar
  scalar Time

  enum OrderingDirection {
    ASC
    DESC
  }

  enum Operator {
    GREATER_THAN
    GREATER_THAN_OR_EQUAL
    LESSER_THAN
    LESSER_THAN_OR_EQUAL
    EQUAL
    NOT_EQUAL
    IN
    LIKE
  }

  input PaginationArgs {
    # No. of page
    pageNumber: Int!

    # No. of results in one page
    pageSize: Int!
  }

  input FilterArgs {
    # Name of the column
    column: String!

    # Value of the column
    value: [String!]

    # Operator i.e. ">", "<", "=", "in", "like"
    operator: Operator!
  }

  input OrderingArgs {
    # Name of the column
    column: String!

    # Direction
    direction: OrderingDirection!
  }

  # Represents pagination information
  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    totalPages: Int!
    totalCount: Int!
  }
  `
];
