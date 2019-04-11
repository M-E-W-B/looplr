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
      .select([
        'comment.id AS id',
        'comment.entity_id AS entityId',
        'user.id AS userId',
        'user.first_name AS firstName',
        'user.last_name AS lastName',
        'user.handle AS handle',
        'user.image AS userImage',
        'comment.rating AS rating',
        'comment.txt AS txt',
        'comment.created_at AS createdAt',
        'comment.updated_at AS updatedAt'
      ])
      .from(this.tableName)
      .leftJoin('user', 'user.id', `${this.tableName}.user_id`);

    query.joinRaw('WHERE comment.is_deleted = 0 AND user.is_deleted = 0');

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getComments(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getCommentById = id =>
    this.knexClient
      .select([
        'comment.id AS id',
        'comment.entity_id AS entityId',
        'user.id AS userId',
        'user.first_name AS firstName',
        'user.last_name AS lastName',
        'user.handle AS handle',
        'user.image AS userImage',
        'comment.rating AS rating',
        'comment.txt AS txt',
        'comment.created_at AS createdAt',
        'comment.updated_at AS updatedAt'
      ])
      .from(this.tableName)
      .leftJoin('user', 'user.id', `${this.tableName}.user_id`)
      .where({
        [`${this.tableName}.id`]: id,
        'user.is_deleted': 0,
        [`${this.tableName}.is_deleted`]: 0
      })
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
          is_deleted: 1
        })
        .where('id', id)
    );
}

module.exports = knexClient => new Repository(knexClient);
