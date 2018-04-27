const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getCollections(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "collection";

    const query = knexClient
      .select([
        "id",
        "name",
        "owner_id",
        "description",
        "tags",
        "created_at",
        "updated_at"
      ])
      .from(tableName);

    query.joinRaw('where ?? is null', [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getCollections(null, orderings, filters);
    return pageInfo(pagination, query);
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

  addProductIntoCollection(collection_id, product_id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("collection_product").insert({
        collection_id,
        product_id
      });
    });
  }

  removeProductFromCollection(collection_id, product_id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("collection_product")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where({
          collection_id,
          product_id
        });
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
