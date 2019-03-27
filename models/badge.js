const list = require('../utils/list');
const pageInfo = require('../utils/page-info');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'badge';
  }

  getBadges = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(['id', 'name', 'description', 'created_at', 'updated_at'])
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getBadges(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getBadgeById = id =>
    this.knexClient
      .select(['id', 'name', 'description', 'created_at', 'updated_at'])
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
          deleted_at: knexClient.fn.now()
        })
        .where('id', id)
    );
}

module.exports = knexClient => new Repository(knexClient);
