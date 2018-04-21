module.exports = [
  `
  type Image {
      # SQL id of this image
      id: Int!,

      # Entity Id for this image
      entity_id: Int!,

      # Type of this image
      # product, collection, product_sizechart, user
      type: Int!,

      # Url of this image
      url: String!,

      # Thumbnail url of this image
      thumbnail_url: String,

      # Description for this image
      description: String,

      # Timestamp when this image was created
      created_at: DateTime!,

      # Timestamp when this image was updated
      updated_at: DateTime,

      # Timestamp when this image was deleted
      deleted_at: DateTime
  }

  input InputCreateImage {
    # EntityId for this image i.e. collectionId, productId, userId
    entity_id: Int!

    # Type of this image
    # product, collection, product_sizechart, user
    type: Int!,

    # Url of this image
    url: String!,

    # Thumbnail url of this image
    thumbnail_url: String,

    # Description for this image
    description: String
  }

  input InputUpdateImage {
    # EntityId for this image i.e. collectionId, productId, userId
    entity_id: Int!

    # Type of this image
    # product, collection, product_sizechart, user
    type: Int!,

    # Url of this image
    url: String!,

    # Thumbnail url of this image
    thumbnail_url: String,

    # Description for this image
    description: String
  }
`
];
