const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getBadges(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "badge";

    const query = knexClient
      .select(["id", "name", "description", "created_at", "updated_at"])
      .from(tableName);

    query.joinRaw('where ?? is null', [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getBadges(null, orderings, filters);
    return pageInfo(pagination, query);
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
