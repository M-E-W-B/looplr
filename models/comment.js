const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'comment';
  }

  getComments = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(
        [
          'id',
          'user_id',
          'entity_id',
          'rating',
          'txt',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getComments(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getCommentById = id =>
    this.knexClient
      .select(
        [
          'id',
          'user_id',
          'entity_id',
          'rating',
          'txt',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({ userId: user_id, entityId: entity_id, rating = null, txt }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName).insert({
        user_id,
        entity_id,
        rating,
        txt
      })
    );

  update = (id, { rating, txt }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          rating,
          txt
        })
        .where('id', id)
    );

  delete = id =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          deleted_at: this.knexClient.fn.now()
        })
        .where('id', id)
    );
}

module.exports = knexClient => new Repository(knexClient);
