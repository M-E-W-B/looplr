const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'collection';
  }

  getCollections = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select([
        'collection.id AS id',
        'collection.name AS name',
        'user.id AS userId',
        'user.first_name AS firstName',
        'user.last_name AS lastName',
        'user.handle AS handle',
        'user.image AS userImage',
        'collection.image AS image',
        'collection.description AS description',
        'collection.tags AS tags',
        'collection.created_at AS created_at',
        'collection.updated_at AS updated_at'
      ])
      .from(this.tableName)
      .leftJoin('user', 'user.id', `${this.tableName}.owner_id`);

    query.joinRaw('WHERE collection.is_deleted = 0 AND user.is_deleted = 0');

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getCollections(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getCollectionById = id =>
    this.knexClient
      .select([
        'collection.id AS id',
        'collection.name AS name',
        'user.id AS userId',
        'user.first_name AS firstName',
        'user.last_name AS lastName',
        'user.handle AS handle',
        'user.image AS userImage',
        'collection.image AS image',
        'collection.description AS description',
        'collection.tags AS tags',
        'collection.created_at AS created_at',
        'collection.updated_at AS updated_at'
      ])
      .from(this.tableName)
      .leftJoin('user', 'user.id', `${this.tableName}.owner_id`)
      .where({
        [`${this.tableName}.id`]: id,
        'user.is_deleted': 0,
        'collection.is_deleted': 0
      })
      .first();

  create = ({
    name,
    ownerId: owner_id = null,
    image,
    description = null,
    tags = null
  }) =>
    this.knexClient.transaction(async trx => {
      const [id] = await trx('entity').insert({ id: null });

      await trx(this.tableName).insert({
        id,
        name,
        owner_id,
        image,
        description,
        tags
      });

      return id;
    });

  update = (id, { name, image, description, tags }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          name,
          image,
          description,
          tags
        })
        .where('id', id)
    );

  addProductIntoCollection = (collection_id, product_id) =>
    this.knexClient.transaction(trx =>
      trx('collection_product').insert({
        collection_id,
        product_id
      })
    );

  removeProductFromCollection = (collection_id, product_id) =>
    this.knexClient.transaction(trx =>
      trx('collection_product')
        .update({
          is_deleted: 1
        })
        .where({
          collection_id,
          product_id
        })
    );

  delete = id =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          is_deleted: 1
        })
        .where('id', id)
    );
}

module.exports = knexClient => new Repository(knexClient);
