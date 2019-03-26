const list = require('../utils/list');
const pageInfo = require('../utils/page-info');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'collection';
  }

  getCollections = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select([
        'id',
        'name',
        'owner_id',
        'description',
        'tags',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getCollections(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getCollectionById = id =>
    this.knexClient
      .select([
        'id',
        'name',
        'owner_id',
        'description',
        'tags',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({ name, owner_id = null, description = null, tags = null }) =>
    this.knexClient.transaction(async function(trx) {
      const [id] = await trx('entity').insert({ id: null });
      await trx(this.tableName).insert({
        id,
        name,
        owner_id,
        description,
        tags
      });

      return id;
    });

  update = (id, { name, description, tags }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          name,
          description,
          tags
        })
        .where('id', id);
    });

  addProductIntoCollection = (collection_id, product_id) =>
    this.knexClient.transaction(function(trx) {
      return trx('collection_product').insert({
        collection_id,
        product_id
      });
    });

  removeProductFromCollection = (collection_id, product_id) =>
    this.knexClient.transaction(function(trx) {
      return trx('collection_product')
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where({
          collection_id,
          product_id
        });
    });

  delete = id =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where('id', id);
    });
}

module.exports = knexClient => new Repository(knexClient);
