const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getSkus() {
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
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getSkusByProductId(productId) {
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
      .where("product_id", productId)
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getInactiveSkus() {
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
      .where("is_active", false)
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
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
