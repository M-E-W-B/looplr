const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getComments(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "comment";

    const query = knexClient
      .select([
        "id",
        "user_id",
        "entity_id",
        "rating",
        "txt",
        "created_at",
        "updated_at"
      ])
      .from(tableName);

    query.joinRaw('where ?? is null', [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getComments(null, orderings, filters);
    return pageInfo(pagination, query);
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
