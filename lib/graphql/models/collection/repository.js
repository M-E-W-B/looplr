const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getCollections() {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "name",
        "owner_id",
        "description",
        "tags",
        "created_at",
        "updated_at"
      ])
      .from("collection")
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getCollectionById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "name",
        "owner_id",
        "description",
        "tags",
        "created_at",
        "updated_at"
      ])
      .from("collection")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({ name, owner_id = null, description = null, tags = null }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(async function(trx) {
      const [id] = await trx("entity").insert({ id: null });
      await trx("collection").insert({
        id,
        name,
        owner_id,
        description,
        tags
      });

      return id;
    });
  }

  update(id, { name, description, tags }) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("collection")
        .update({
          name,
          description,
          tags
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("collection")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
