const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'wishlist';
  }

  getWishlistByUserId = userId =>
    this.knexClient
      .select(
        ['id', 'user_id', 'sku_id', 'created_at', 'updated_at'].map(
          i => `${i} AS ${camelCase(i)}`
        )
      )
      .from(this.tableName)
      .where('user_id', userId)
      .whereNull('deleted_at')
      .first();

  addProductSkuIntoWishlist = (user_id, sku_id) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName).insert({
        user_id,
        sku_id
      })
    );

  removeProductSkuFromWishlist = (user_id, sku_id) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          deleted_at: this.knexClient.fn.now()
        })
        .where({
          user_id,
          sku_id
        })
    );
}

module.exports = knexClient => new Repository(knexClient);
