const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getProducts() {
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
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
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
