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

    query.joinRaw('WHERE badge.deleted_at IS NULL');

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
      .where('user_badge.user_id', userId)
      .whereNull('user_badge.deleted_at')
      .whereNull('badge.deleted_at')
      .orderBy('user_badge.created_at', 'desc');

  getBadgeById = id =>
    this.knexClient
      .select(
        ['id', 'name', 'description', 'created_at', 'updated_at'].map(
          i => `${i} AS ${camelCase(i)}`
        )
      )
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
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
          deleted_at: this.knexClient.fn.now()
        })
        .where('id', id)
    );
}

module.exports = knexClient => new Repository(knexClient);
