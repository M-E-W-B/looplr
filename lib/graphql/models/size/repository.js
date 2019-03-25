const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getSizes(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "size";

    const query = knexClient
      .select(["id", "name", "created_at", "updated_at"])
      .from(tableName);

    query.joinRaw('where ?? is null', [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getSizes(null, orderings, filters);
    return pageInfo(pagination, query);
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
