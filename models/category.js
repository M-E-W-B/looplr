const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'category';
  }

  getCategories = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(
        ['id', 'name', 'parent_category_id', 'created_at', 'updated_at'].map(
          i => `${i} AS ${camelCase(i)}`
        )
      )
      .from(this.tableName);

    query.joinRaw('WHERE category.is_deleted = 0');

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getCategories(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getCategoryById = id =>
    this.knexClient
      .select(
        ['id', 'name', 'parent_category_id', 'created_at', 'updated_at'].map(
          i => `${i} AS ${camelCase(i)}`
        )
      )
      .from(this.tableName)
      .where({
        id,
        is_deleted: 0
      })
      .first();

  create = ({ name, parentCategoryId: parent_category_id }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName).insert({
        name,
        parent_category_id
      })
    );

  update = (id, { name, parent_category_id }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          name,
          parent_category_id
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
