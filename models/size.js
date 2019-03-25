const list = require('../utils/list');
const pageInfo = require('../utils/page-info');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'size';
  }

  getSizes = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(['id', 'name', 'created_at', 'updated_at'])
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getSizes(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getSizeById = id =>
    this.knexClient
      .select(['id', 'name', 'created_at', 'updated_at'])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({ name }) =>
    this.knexClient.transaction(async function(trx) {
      const [id] = await trx('sku_attribute').insert({ id: null });
      await trx(this.tableName).insert({
        id,
        name
      });

      return id;
    });

  update = (id, { name }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          name
        })
        .where('id', id);
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
