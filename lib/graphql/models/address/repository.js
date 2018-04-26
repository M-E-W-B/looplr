const bcrypt = require("bcrypt-nodejs");
const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getAddresses(pagination = null, orderings = [], filters = []) {
    const knexClient = this.knexClient;
    const tableName = "address";

    const query = knexClient
      .select([
        "id",
        "user_id",
        "street_address",
        "landmark",
        "city",
        "state",
        "postal_code",
        "created_at",
        "updated_at"
      ])
      .from(tableName);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings = [], filters = []) {
    const query = this.getAddresses(null, orderings, filters);
    return pageInfo(pagination, query);
  }

  getAddressById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "user_id",
        "street_address",
        "landmark",
        "city",
        "state",
        "postal_code",
        "created_at",
        "updated_at"
      ])
      .from("address")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({
    user_id,
    street_address,
    landmark = null,
    city,
    state,
    postal_code
  }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(function(trx) {
      return trx("address").insert({
        user_id,
        street_address,
        landmark,
        city,
        state,
        postal_code
      });
    });
  }

  update(id, { user_id, street_address, landmark, city, state, postal_code }) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("address")
        .update({
          user_id,
          street_address,
          landmark,
          city,
          state,
          postal_code
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("address")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
