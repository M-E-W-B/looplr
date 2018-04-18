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
      .from("adderss")
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
      .from("adderss")
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
      return trx("adderss").insert({
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
      return trx("adderss")
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
      return trx("adderss")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
