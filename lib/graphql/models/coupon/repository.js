const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getCoupons() {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "code",
        "description",
        "max_uses",
        "max_uses_per_user",
        "min_order",
        "is_percentage",
        "discount",
        "starts_at",
        "expires_at",
        "created_at",
        "updated_at"
      ])
      .from("coupon")
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getCouponById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "code",
        "description",
        "max_uses",
        "max_uses_per_user",
        "min_order",
        "is_percentage",
        "discount",
        "starts_at",
        "expires_at",
        "created_at",
        "updated_at"
      ])
      .from("coupon")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({
    code,
    description = null,
    max_uses = null,
    max_uses_per_user = null,
    min_order = null,
    is_percentage,
    discount = null,
    starts_at = null,
    expires_at = null
  }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(function(trx) {
      return trx("coupon").insert({
        code,
        description,
        max_uses,
        max_uses_per_user,
        min_order,
        is_percentage,
        discount,
        starts_at,
        expires_at
      });
    });
  }

  update(
    id,
    {
      code,
      description,
      max_uses,
      max_uses_per_user,
      min_order,
      is_percentage,
      discount,
      starts_at,
      expires_at
    }
  ) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("coupon")
        .update({
          code,
          description,
          max_uses,
          max_uses_per_user,
          min_order,
          is_percentage,
          discount,
          starts_at,
          expires_at
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("coupon")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
