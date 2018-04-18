const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getColors() {
    const knexClient = this.knexClient;
    return knexClient
      .select(["id", "hexcode", "created_at", "updated_at"])
      .from("color")
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
  }

  getColorById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select(["id", "hexcode", "created_at", "updated_at"])
      .from("color")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({ hexcode }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(async function(trx) {
      const [id] = await trx("sku_attribute").insert({ id: null });
      await trx("color").insert({
        id,
        hexcode
      });

      return id;
    });
  }

  update(id, { hexcode }) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("color")
        .update({
          hexcode
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("color")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
