module.exports = [
  `
  type Coupon {
      # SQL id of this coupon
      id: Int!,

      # Code of this coupon
      code: String!

      # Description for this coupon
      description: String,

      # Max uses overall, if any, allowed for this coupon
      max_uses: Int,

      # Max uses per user, if any, allowed for this coupon
      max_uses_per_user: Int,

      # Min order value for which this coupon is allowed
      min_order: Int,

      # Whether this discount value is fixed or %
      is_percentage: Boolean!,

      # Discount for this coupon
      discount: Float,

      # Starting date from which this coupon is valid
      starts_at: DateTime,

      # Ending date till which this coupon is valid
      expires_at: DateTime,

      # Timestamp when this coupon was created
      created_at: DateTime!,

      # Timestamp when this coupon was updated
      updated_at: DateTime,

      # Timestamp when this coupon was deleted
      deleted_at: DateTime
  }

  input InputCreateCoupon {
    # Code of this coupon
    code: String!

    # Description for this coupon
    description: String,

    # Max uses overall, if any, allowed for this coupon
    max_uses: Int,

    # Max uses per user, if any, allowed for this coupon
    max_uses_per_user: Int,

    # Min order value for which this coupon is allowed
    min_order: Int,

    # Whether this discount value is fixed or %
    is_percentage: Boolean!,

    # Discount for this coupon
    discount: Float,

    # Starting date from which this coupon is valid
    starts_at: DateTime,

    # Ending date till which this coupon is valid
    expires_at: DateTime
  }

  input InputUpdateCoupon {
    # Code of this coupon
    code: String!

    # Description for this coupon
    description: String,

    # Max uses overall, if any, allowed for this coupon
    max_uses: Int,

    # Max uses per user, if any, allowed for this coupon
    max_uses_per_user: Int,

    # Min order value for which this coupon is allowed
    min_order: Int,

    # Whether this discount value is fixed or %
    is_percentage: Boolean!,

    # Discount for this coupon
    discount: Float,

    # Starting date from which this coupon is valid
    starts_at: DateTime,

    # Ending date till which this coupon is valid
    expires_at: DateTime
  }
`
];
