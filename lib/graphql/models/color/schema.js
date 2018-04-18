module.exports = [
  `
  type Color {
      # SQL id of this color
      id: Int!,

      # Hexcode of this color
      hexcode: String!

      # Timestamp when this color was created
      created_at: DateTime!,

      # Timestamp when this color was updated
      updated_at: DateTime,

      # Timestamp when this color was deleted
      deleted_at: DateTime
  }

  input InputCreateColor {
    # Hexcode of this color
    hexcode: String!
  }

  input InputUpdateColor {
    # Hexcode of this color
    hexcode: String!
  }
`
];
