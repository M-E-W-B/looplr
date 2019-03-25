class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'sku';
  }

  getSkus = () =>
    this.knexClient
      .select([
        'id',
        'product_id',
        'sku_attribute_id',
        'stock',
        'price',
        'discount',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getSkusByProductId = productId =>
    this.knexClient
      .select([
        'id',
        'product_id',
        'sku_attribute_id',
        'stock',
        'price',
        'discount',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('product_id', productId)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getInactiveSkus = () =>
    this.knexClient
      .select([
        'id',
        'product_id',
        'sku_attribute_id',
        'stock',
        'price',
        'discount',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('is_active', false)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getSkuById = id =>
    this.knexClient
      .select([
        'id',
        'product_id',
        'sku_attribute_id',
        'stock',
        'price',
        'discount',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    product_id,
    sku_attribute_id,
    stock,
    price = null,
    discount = null,
    is_active
  }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName).insert({
        product_id,
        sku_attribute_id,
        stock,
        price,
        discount,
        is_active
      });
    });

  update = (
    id,
    { product_id, sku_attribute_id, stock, price, discount, is_active }
  ) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          product_id,
          sku_attribute_id,
          stock,
          price,
          discount,
          is_active
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
