const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getCoupons(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "coupon";

    const query = knexClient
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
      .from(tableName);

    query.joinRaw('where ?? is null', [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getCoupons(null, orderings, filters);
    return pageInfo(pagination, query);
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
