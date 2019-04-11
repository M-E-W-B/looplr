const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'sku';
  }

  getSkus = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select([
        'sku.id AS id',
        'color.hexcode AS color',
        'size.name AS size',
        'sku.stock AS stock',
        'sku.price AS price',
        'sku.discount AS discount',
        'sku.created_at AS createdAt',
        'sku.updated_at AS updatedAt'
      ])
      .from(this.tableName)
      .leftJoin('size', 'size.id', `${this.tableName}.sku_attribute_id`)
      .leftJoin('color', 'color.id', `${this.tableName}.sku_attribute_id`);

    query.joinRaw(
      'WHERE sku.is_active = 1 AND sku.is_deleted = 0 AND size.is_deleted = 0 AND color.is_deleted = 0'
    );

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getSkus(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getSkusByProductId = productId =>
    this.knexClient
      .select([
        'sku.id AS id',
        'color.hexcode AS color',
        'size.name AS size',
        'sku.stock AS stock',
        'sku.price AS price',
        'sku.discount AS discount',
        'sku.created_at AS createdAt',
        'sku.updated_at AS updatedAt'
      ])
      .from(this.tableName)
      .leftJoin('product', 'product.id', `${this.tableName}.product_id`)
      .leftJoin('size', 'size.id', `${this.tableName}.sku_attribute_id`)
      .leftJoin('color', 'color.id', `${this.tableName}.sku_attribute_id`)
      .where({
        [`${this.tableName}.product_id`]: productId,
        [`${this.tableName}.is_active`]: 1,
        'product.is_deleted': 0,
        'size.is_deleted': 0,
        'color.is_deleted': 0,
        [`${this.tableName}.is_deleted`]: 0
      });

  getSkuById = id =>
    this.knexClient
      .select(
        [
          'id',
          'product_id',
          'sku_attribute_id',
          'stock',
          'price',
          'discount',
          'is_active',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName)
      .where({ id, is_deleted: 0 })
      .first();

  create = ({
    productId: product_id,
    skuAttributeId: sku_attribute_id,
    stock,
    price = null,
    discount = null,
    isActive: is_active
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
    {
      productId: product_id,
      skuAttributeId: sku_attribute_id,
      stock,
      price = null,
      discount = null,
      isActive: is_active
    }
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
          is_deleted: 1
        })
        .where('id', id)
    );
}

module.exports = knexClient => new Repository(knexClient);
