module.exports = [
  `
  type Sku {
      # SQL id of this sku
      id: Int!,

      # Product id of which this is a sku
      product_id: String!

      # Sku attribute id of this sku i.e. colorId, sizeId
      sku_attribute_id: Int!,

      # Stock available for this sku
      stock: Int!,

      # Price for this sku
      price: Float,

      # Discount, if any, for this sku
      discount: Float,

      # Is sku active
      is_active: Boolean!,

      # Timestamp when this sku was created
      created_at: DateTime!,

      # Timestamp when this sku was updated
      updated_at: DateTime,

      # Timestamp when this sku was deleted
      deleted_at: DateTime
  }

  extend type Sku {
    # Sku attribute (color) of this sku
    color: String,

    # Sku attribute (size) of this sku
    size: String
  }

  input InputCreateSku {
    # Product id of which this is a sku
    product_id: String!

    # Sku attribute id of this sku i.e. colorId, sizeId
    sku_attribute_id: Int!,

    # Stock available for this sku
    stock: Int!,

    # Price for this sku
    price: Float,

    # Discount, if any, for this sku
    discount: Float,

    # Is sku active
    is_active: Boolean!
  }

  input InputUpdateSku {
    # Product id of which this is a sku
    product_id: String!

    # Sku attribute id of this sku i.e. colorId, sizeId
    sku_attribute_id: Int!,

    # Stock available for this sku
    stock: Int!,

    # Price for this sku
    price: Float,

    # Discount, if any, for this sku
    discount: Float,

    # Is sku active
    is_active: Boolean!
  }
`
];
