const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getSizes() {
    const knexClient = this.knexClient;
    return knexClient
      .select(["id", "name", "created_at", "updated_at"])
      .from("size")
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getSizeById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select(["id", "name", "created_at", "updated_at"])
      .from("size")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({ name }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(async function(trx) {
      const [id] = await trx("sku_attribute").insert({ id: null });
      await trx("size").insert({
        id,
        name
      });

      return id;
    });
  }

  update(id, { name }) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("size")
        .update({
          name
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("size")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
