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
    value: String!
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
