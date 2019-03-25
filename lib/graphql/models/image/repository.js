const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getImages(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "image";

    const query = knexClient
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
      .from(tableName);

    query.joinRaw('where ?? is null', [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getImages(null, orderings, filters);
    return pageInfo(pagination, query);
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
