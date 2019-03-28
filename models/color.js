const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'color';
  }

  getColors = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(
        ['id', 'hexcode', 'created_at', 'updated_at'].map(
          i => `${i} AS ${camelCase(i)}`
        )
      )
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getColors(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getColorById = id =>
    this.knexClient
      .select(
        ['id', 'hexcode', 'created_at', 'updated_at'].map(
          i => `${i} AS ${camelCase(i)}`
        )
      )
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({ hexcode }) =>
    this.knexClient.transaction(async trx => {
      const [id] = await trx('sku_attribute').insert({ id: null });

      await trx(this.tableName).insert({
        id,
        hexcode
      });

      return id;
    });

  update = (id, { hexcode }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          hexcode
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
