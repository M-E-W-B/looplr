const list = require('../utils/list');
const pageInfo = require('../utils/page-info');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'image';
  }

  getImages = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select([
        'id',
        'entity_id',
        'type',
        'url',
        'thumbnail_url',
        'description',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getImages(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getImageById = id =>
    this.knexClient
      .select([
        'id',
        'entity_id',
        'type',
        'url',
        'thumbnail_url',
        'description',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    entity_id,
    type,
    url,
    thumbnail_url = null,
    description = null
  }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName).insert({
        entity_id,
        type,
        url,
        thumbnail_url,
        description
      });
    });

  update = (id, { entity_id, type, url, thumbnail_url, description }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          entity_id,
          type,
          url,
          thumbnail_url,
          description
        })
        .where('id', id);
    });

  delete = id =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          deleted_at: this.knexClient.fn.now()
        })
        .where('id', id);
    });
}

module.exports = knexClient => new Repository(knexClient);
