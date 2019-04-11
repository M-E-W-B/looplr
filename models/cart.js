const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'cart_item';
  }

  getCartIdByUserId = async userId => {
    let cart = await this.knexClient
      .select(['id'])
      .from('cart')
      .where('is_deleted', 0)
      .first();

    if (!cart) {
      cart = await this.knexClient.transaction(async trx => {
        const [id] = await trx('cart').insert({ id: null });
        return id;
      });
    }

    return cart.id;
  };

  getCartByUserId = userId =>
    this.knexClient
      .select([
        'cart.id AS id',
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
        'cart_item.quantity AS quantity',
        'cart.created_at AS createdAt',
        'cart.updated_at AS updatedAt'
      ])
      .from('cart')
      .innerJoin('cart_item', 'cart_item.cart_id', 'cart.id')
      .leftJoin('sku', 'sku.id', `cart_item.sku_id`)
      .leftJoin('product', 'product.id', 'sku.product_id')
      .where({
        'cart.user_id': userId,
        'cart.is_deleted': 0,
        'cart_item.is_deleted': 0,
        'product.is_deleted': 0,
        'sku.is_deleted': 0
      });

  create = ({ userId: user_id }) =>
    this.knexClient.transaction(trx =>
      trx('cart').insert({
        user_id
      })
    );

  delete = id =>
    this.knexClient.transaction(trx =>
      trx('cart')
        .update({
          is_deleted: 1
        })
        .where('id', id)
    );

  increaseCartItem = (cart_id, sku_id) =>
    this.knexClient(this.tableName)
      .increment('quantity')
      .where({
        cart_id,
        sku_id
      });

  decreaseCartItem = (cart_id, sku_id) =>
    this.knexClient(this.tableName)
      .decrement('quantity')
      .where({
        cart_id,
        sku_id
      });

  addProductSkuIntoCart = (cart_id, sku_id) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName).insert({
        cart_id,
        sku_id,
        quantity: 1
      })
    );

  removeProductSkuFromCart = (cart_id, sku_id) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          is_deleted: 1
        })
        .where({
          cart_id,
          sku_id
        })
    );
}

module.exports = knexClient => new Repository(knexClient);
