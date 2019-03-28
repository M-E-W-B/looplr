const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'coupon';
  }

  getCoupons = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(
        [
          'id',
          'code',
          'description',
          'max_uses',
          'max_uses_per_user',
          'min_order',
          'is_percentage',
          'discount',
          'starts_at',
          'expires_at',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getCoupons(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getCouponById = id =>
    this.knexClient
      .select(
        [
          'id',
          'code',
          'description',
          'max_uses',
          'max_uses_per_user',
          'min_order',
          'is_percentage',
          'discount',
          'starts_at',
          'expires_at',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    code,
    description = null,
    maxUses: max_uses = null,
    maxUsesPerUser: max_uses_per_user = null,
    minOrder: min_order = null,
    isPercentage: is_percentage,
    discount = null,
    startsAt: starts_at = null,
    expiresAt: expires_at = null
  }) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName).insert({
        code,
        description,
        max_uses,
        max_uses_per_user,
        min_order,
        is_percentage,
        discount,
        starts_at,
        expires_at
      })
    );

  update = (
    id,
    {
      code,
      description,
      maxUses: max_uses,
      maxUsesPerUser: max_uses_per_user,
      minOrder: min_order,
      isPercentage: is_percentage,
      discount,
      startsAt: starts_at,
      expiresAt: expires_at
    }
  ) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          code,
          description,
          max_uses,
          max_uses_per_user,
          min_order,
          is_percentage,
          discount,
          starts_at,
          expires_at
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
