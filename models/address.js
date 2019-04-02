const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'address';
  }

  getAddresses = (pagination = null, orderings = [], filters = []) => {
    const query = this.knexClient
      .select(
        [
          'id',
          'street_address',
          'landmark',
          'city',
          'state',
          'postal_code',
          'type',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings = [], filters = []) => {
    const query = this.getAddresses(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getAddressById = id =>
    this.knexClient
      .select(
        [
          'id',
          'street_address',
          'landmark',
          'city',
          'state',
          'postal_code',
          'type',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    userId: user_id,
    streetAddress: street_address,
    landmark = null,
    city,
    state,
    postalCode: postal_code,
    type
  }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName).insert({
        user_id,
        street_address,
        landmark,
        city,
        state,
        postal_code,
        type
      })
    );

  update = (
    id,
    {
      userId: user_id,
      streetAddress: street_address,
      landmark,
      city,
      state,
      postalCode: postal_code,
      type
    }
  ) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          user_id,
          street_address,
          landmark,
          city,
          state,
          postal_code,
          type
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
