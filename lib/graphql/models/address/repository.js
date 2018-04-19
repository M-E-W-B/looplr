const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getAddresses() {
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
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getAddressesByUserId(userId) {
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
      .where("user_id", userId)
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
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
