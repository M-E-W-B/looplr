const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getColors(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "color";

    const query = knexClient
      .select(["id", "hexcode", "created_at", "updated_at"])
      .from("color");

    query.joinRaw('where ?? is null', [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getColors(null, orderings, filters);
    return pageInfo(pagination, query);
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
