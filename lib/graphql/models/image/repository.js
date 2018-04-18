const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getImages() {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "entity_id",
        "type",
        "url",
        "thumbnail_url",
        "description",
        "created_at",
        "updated_at"
      ])
      .from("image")
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getImageById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "entity_id",
        "type",
        "url",
        "thumbnail_url",
        "description",
        "created_at",
        "updated_at"
      ])
      .from("image")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({ entity_id, type, url, thumbnail_url = null, description = null }) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("image").insert({
        entity_id,
        type,
        url,
        thumbnail_url,
        description
      });
    });
  }

  update(id, { entity_id, type, url, thumbnail_url, description }) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("image")
        .update({
          entity_id,
          type,
          url,
          thumbnail_url,
          description
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("image")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
