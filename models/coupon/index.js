class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'coupon';
  }

  getCoupons = () =>
    this.knexClient
      .select([
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
      ])
      .from(this.tableName)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getCouponById = id =>
    this.knexClient
      .select([
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
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    code,
    description = null,
    max_uses = null,
    max_uses_per_user = null,
    min_order = null,
    is_percentage,
    discount = null,
    starts_at = null,
    expires_at = null
  }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName).insert({
        code,
        description,
        max_uses,
        max_uses_per_user,
        min_order,
        is_percentage,
        discount,
        starts_at,
        expires_at
      });
    });

  update = (
    id,
    {
      code,
      description,
      max_uses,
      max_uses_per_user,
      min_order,
      is_percentage,
      discount,
      starts_at,
      expires_at
    }
  ) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
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