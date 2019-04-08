const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'wishlist';
  }

  getWishlistByUserId = userId =>
    this.knexClient
      .select([
        'wishlist.id AS id',
        'sku.id AS skuId',
        'sku.stock AS stock',
        'sku.price AS price',
        'sku.discount AS discount',
        'product.id AS productId',
        'product.name AS name',
        'product.description AS description',
        'product.storename AS storename',
        'product.gender AS gender',
        'product.sizechart AS sizechart',
        'product.image AS image',
        'product.tags AS tags',
        'wishlist.created_at AS createdAt',
        'wishlist.updated_at AS updatedAt'
      ])
      .from(this.tableName)
      .leftJoin('sku', 'sku.id', `${this.tableName}.sku_id`)
      .leftJoin('product', 'product.id', 'sku.product_id')
      .where(`${this.tableName}.user_id`, userId)
      .whereNull(`${this.tableName}.deleted_at`)
      .whereNull('sku.deleted_at')
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
