module.exports = [
  `
  enum ProductGender {
      M
      F
      U
  }

  type Product {
      # SQL id of this product
      id: Int!,

      # Name of this product
      name: String!

      # Category of this product
      category: String,

      # Subcategory of this product
      subcategory: String,

      # Description of this product
      description: String,

      # Storename of this product
      storename: String,

      # Gender for this product
      gender: ProductGender!,

      # JSON encoded tags array for this product
      tags: String,

      # Promotional text for this product
      promotional_text: String,

      # Timestamp when this product was created
      created_at: DateTime!,

      # Timestamp when this product was updated
      updated_at: DateTime,

      # Timestamp when this product was deleted
      deleted_at: DateTime
  }

  extend type Product {
    # Skus for this product
    skus: [Sku]

    # Images for this product
    images: [Image]

    # Sizechart image for this product
    sizechart: [Image]
  }

  input InputCreateProduct {
    # Name of this product
    name: String!

    # Category of this product
    category: String,

    # Subcategory of this product
    subcategory: String,

    # Description of this product
    description: String,

    # Storename of this product
    storename: String,

    # Gender for this product
    gender: ProductGender!,

    # JSON encoded tags array for this product
    tags: String,

    # Promotional text for this product
    promotional_text: String
  }

  input InputUpdateProduct {
    # Name of this product
    name: String!

    # Category of this product
    category: String,

    # Subcategory of this product
    subcategory: String,

    # Description of this product
    description: String,

    # Storename of this product
    storename: String,

    # Gender for this product
    gender: ProductGender!,

    # JSON encoded tags array for this product
    tags: String,

    # Promotional text for this product
    promotional_text: String
  }
`
];
