const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'badge';
  }

  getBadges = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(
        ['id', 'name', 'description', 'created_at', 'updated_at'].map(
          i => `${i} AS ${camelCase(i)}`
        )
      )
      .from(this.tableName);

    query.joinRaw('WHERE badge.is_deleted = 0');

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getBadges(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getBadgesByUserId = userId =>
    this.knexClient
      .select([
        'badge.id AS id',
        'badge.name AS name',
        'badge.description AS description',
        'user_badge.created_at AS createdAt',
        'user_badge.updated_at AS updatedAt'
      ])
      .from('user_badge')
      .innerJoin(this.tableName, 'badge.id', 'user_badge.badge_id')
      .where({
        'user_badge.user_id': userId,
        'user_badge.is_deleted': 0,
        'badge.is_deleted': 0
      });

  getBadgeById = id =>
    this.knexClient
      .select(
        ['id', 'name', 'description', 'created_at', 'updated_at'].map(
          i => `${i} AS ${camelCase(i)}`
        )
      )
      .from(this.tableName)
      .where({
        id,
        is_deleted: 0
      })
      .first();

  create = ({ name, description = null }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName).insert({
        name,
        description
      })
    );

  update = (id, { name, description }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          name,
          description
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
