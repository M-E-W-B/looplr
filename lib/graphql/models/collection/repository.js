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

  getCollectionsByUserId(userId) {
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
      .where("owner_id", userId)
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

  getProductsByCollectionId(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "product.id AS id",
        "product.name AS name",
        "product.category AS category",
        "product.subcategory AS subcategory",
        "product.description AS description",
        "product.storename AS storename",
        "product.gender AS gender",
        "product.tags AS tags",
        "product.promotional_text AS promotional_text",
        "product.created_at AS created_at",
        "product.updated_at AS updated_at"
      ])
      .from("collection_product")
      .innerJoin("product", "product.id", "collection_product.product_id")
      .where("collection_product.collection_id", id)
      .whereNull("collection_product.deleted_at")
      .whereNull("product.deleted_at")
      .orderBy("collection_product.created_at", "desc");
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
