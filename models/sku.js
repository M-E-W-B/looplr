const list = require('../utils/list');
const pageInfo = require('../utils/page-info');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'sku';
  }

  getSkus = (pagination, orderings, filters) => {
    const query = this.knexClient
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
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getSkus(null, orderings, filters);
    return pageInfo(pagination, query);
  };

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
    this.knexClient.transaction(trx =>
      trx(this.tableName).insert({
        product_id,
        sku_attribute_id,
        stock,
        price,
        discount,
        is_active
      })
    );

  update = (
    id,
    { product_id, sku_attribute_id, stock, price, discount, is_active }
  ) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          product_id,
          sku_attribute_id,
          stock,
          price,
          discount,
          is_active
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
