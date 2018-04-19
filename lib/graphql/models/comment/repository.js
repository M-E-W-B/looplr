const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getComments() {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "user_id",
        "entity_id",
        "rating",
        "txt",
        "created_at",
        "updated_at"
      ])
      .from("comment")
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getCommentsByUserId(userId) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "user_id",
        "entity_id",
        "rating",
        "txt",
        "created_at",
        "updated_at"
      ])
      .from("comment")
      .where("user_id", userId)
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getCommentsOn(entityId) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "user_id",
        "entity_id",
        "rating",
        "txt",
        "created_at",
        "updated_at"
      ])
      .from("comment")
      .where("entity_id", entityId)
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getCommentById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "user_id",
        "entity_id",
        "rating",
        "txt",
        "created_at",
        "updated_at"
      ])
      .from("comment")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({ user_id, entity_id, rating = null, txt }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(function(trx) {
      return trx("comment").insert({
        user_id,
        entity_id,
        rating,
        txt
      });
    });
  }

  update(id, { rating, txt }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(function(trx) {
      return trx("comment")
        .update({
          rating,
          txt
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("comment")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
