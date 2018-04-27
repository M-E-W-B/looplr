const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getProducts(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "product";

    const query = knexClient
      .select([
        "id",
        "name",
        "category",
        "subcategory",
        "description",
        "storename",
        "gender",
        "tags",
        "promotional_text",
        "created_at",
        "updated_at"
      ])
      .from(tableName);

    query.joinRaw("where ?? is null", [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getProducts(null, orderings, filters);
    return pageInfo(pagination, query);
  }

  getProductsByCollectionId(collectionId, pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "product";

    const query = knexClient
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
      .innerJoin("product", "product.id", "collection_product.product_id");

    query.joinRaw(
      "where collection_product.collection_id = ? and collection_product.deleted_at is null and product.deleted_at is null",
      [collectionId]
    );

    return list(pagination, orderings, filters, query, tableName);
  }

  getProductById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "name",
        "category",
        "subcategory",
        "description",
        "storename",
        "gender",
        "tags",
        "promotional_text",
        "created_at",
        "updated_at"
      ])
      .from("product")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  create({
    name,
    category = null,
    subcategory = null,
    description = null,
    storename = null,
    gender = "U",
    tags = null,
    promotional_text = null
  }) {
    const knexClient = this.knexClient;

    return knexClient.transaction(async function(trx) {
      const [id] = await trx("entity").insert({ id: null });
      await trx("product").insert({
        id,
        name,
        category,
        subcategory,
        description,
        storename,
        gender,
        tags,
        promotional_text
      });

      return id;
    });
  }

  update(
    id,
    {
      name,
      category,
      subcategory,
      description,
      storename,
      gender,
      tags,
      promotional_text
    }
  ) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("product")
        .update({
          name,
          category,
          subcategory,
          description,
          storename,
          gender,
          tags,
          promotional_text
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("product")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
