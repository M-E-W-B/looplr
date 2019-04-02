const list = require('../utils/list');
const pageInfo = require('../utils/page-info');
const camelCase = require('lodash.camelcase');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'product';
  }

  getProducts = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(
        [
          'id',
          'name',
          'category',
          'subcategory',
          'description',
          'storename',
          'sizechart',
          'image',
          'gender',
          'tags',
          'promotional_text',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getProducts(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  // getProductsByCollectionId = (
  //   collectionId,
  //   pagination,
  //   orderings,
  //   filters
  // ) => {
  //   const query = this.knexClient
  //     .select([
  //       'product.id AS id',
  //       'product.name AS name',
  //       'product.category AS category',
  //       'product.subcategory AS subcategory',
  //       'product.description AS description',
  //       'product.storename AS storename',
  // 'product.gender AS gender',
  // 'product.sizechart AS sizechart',
  // 'product.image AS image',
  //       'product.tags AS tags',
  //       'product.promotional_text AS promotionalText',
  //       'product.created_at AS createdAt',
  //       'product.updated_at AS updatedAt'
  //     ])
  //     .from('collection_product')
  //     .innerJoin(this.tableName, 'product.id', 'collection_product.product_id');

  //   query.joinRaw(
  //     'where collection_product.collection_id = ? and collection_product.deleted_at is null and product.deleted_at is null',
  //     [collectionId]
  //   );

  //   return list(pagination, orderings, filters, query, this.tableName);
  // };

  getFullProductById = id =>
    this.knexClient
      .select([
        'product.id AS id',
        'product.name AS name',
        'product.category AS',
        'product.subcategory AS subcategory',
        'product.description AS description',
        'product.storename AS storename',
        'product.gender AS gender',
        'product.sizechart AS sizechart',
        'product.image AS image',
        'product.tags AS tags',
        'product.promotional_text AS promotional_text',
        'product.created_at AS created_at',
        'product.updated_at AS updated_at',
        'sku.id AS sku_id',
        'sku.stock AS stock',
        'sku.price AS price',
        'sku.discount AS discount',
        'sku.is_active AS is_active',
        'color.hexcode AS color',
        'size.name AS size'
      ])
      .from(this.tableName)
      .leftJoin('sku', 'product.id', 'sku.product_id')
      .leftJoin('color', 'color.id', 'sku.sku_attribute_id')
      .leftJoin('size', 'size.id', 'sku.sku_attribute_id')
      .where('product.id', id)
      .whereNull('product.deleted_at')
      .whereNull('sku.deleted_at')
      .whereNull('color.deleted_at')
      .whereNull('size.deleted_at')
      .orderBy('sku.created_at', 'desc')
      .first();

  getProductById = id =>
    this.knexClient
      .select(
        [
          'id',
          'name',
          'category',
          'subcategory',
          'description',
          'storename',
          'gender',
          'sizechart',
          'image',
          'tags',
          'promotional_text',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    name,
    category = null,
    subcategory = null,
    description = null,
    image,
    sizechart,
    storename = null,
    gender = 'U',
    tags = null,
    promotionalText: promotional_text = null
  }) =>
    this.knexClient.transaction(async trx => {
      const [id] = await trx('entity').insert({ id: null });

      await trx(this.tableName).insert({
        id,
        name,
        category,
        subcategory,
        description,
        image,
        sizechart,
        storename,
        gender,
        tags,
        promotional_text
      });

      return id;
    });

  update = (
    id,
    {
      name,
      category,
      subcategory,
      description,
      image,
      sizechart,
      storename,
      gender,
      tags,
      promotionalText: promotional_text
    }
  ) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          name,
          category,
          subcategory,
          description,
          image,
          sizechart,
          storename,
          gender,
          tags,
          promotional_text
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
