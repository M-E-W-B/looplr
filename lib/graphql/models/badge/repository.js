const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getBadges() {
    const knexClient = this.knexClient;
    return knexClient
      .select(["id", "name", "description", "created_at", "updated_at"])
      .from("badge")
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getBadgeById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select(["id", "name", "description", "created_at", "updated_at"])
      .from("badge")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({ name, description = null }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(function(trx) {
      return trx("badge").insert({
        id,
        name,
        description
      });
    });
  }

  update(id, { name, description }) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("badge")
        .update({
          name,
          description
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("badge")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
