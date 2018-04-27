const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getSkus(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "sku";

    const query = knexClient
      .select([
        "id",
        "product_id",
        "sku_attribute_id",
        "stock",
        "price",
        "discount",
        "is_active",
        "created_at",
        "updated_at"
      ])
      .from(tableName);

    query.joinRaw('where ?? is null', [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getSkus(null, orderings, filters);
    return pageInfo(pagination, query);
  }

  getSkuById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "product_id",
        "sku_attribute_id",
        "stock",
        "price",
        "discount",
        "is_active",
        "created_at",
        "updated_at"
      ])
      .from("sku")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({
    product_id,
    sku_attribute_id,
    stock,
    price = null,
    discount = null,
    is_active
  }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(function(trx) {
      return trx("sku").insert({
        product_id,
        sku_attribute_id,
        stock,
        price,
        discount,
        is_active
      });
    });
  }

  update(
    id,
    { product_id, sku_attribute_id, stock, price, discount, is_active }
  ) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("sku")
        .update({
          product_id,
          sku_attribute_id,
          stock,
          price,
          discount,
          is_active
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("sku")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
