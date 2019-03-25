const list = require('../../utils/list');
const pageInfo = require('../../utils/page-info');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'address';
  }

  getAddresses = (pagination = null, orderings = [], filters = []) => {
    const query = this.knexClient
      .select([
        'id',
        'user_id',
        'street_address',
        'landmark',
        'city',
        'state',
        'postal_code',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings = [], filters = []) => {
    const query = this.getAddresses(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getAddressById = id =>
    this.knexClient
      .select([
        'id',
        'user_id',
        'street_address',
        'landmark',
        'city',
        'state',
        'postal_code',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    user_id,
    street_address,
    landmark = null,
    city,
    state,
    postal_code
  }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName).insert({
        user_id,
        street_address,
        landmark,
        city,
        state,
        postal_code
      });
    });

  update = (
    id,
    { user_id, street_address, landmark, city, state, postal_code }
  ) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          user_id,
          street_address,
          landmark,
          city,
          state,
          postal_code
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
