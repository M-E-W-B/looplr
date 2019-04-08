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
          'subcategory_id',
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

    query.joinRaw('WHERE product.deleted_at IS NULL');

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getProducts(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getProductById = id =>
    this.knexClient
      .select([
        'product.id AS id',
        'product.name AS name',
        'category.name AS subcategory',
        'product.description AS description',
        'product.storename AS storename',
        'product.gender AS gender',
        'product.sizechart AS sizechart',
        'product.image AS image',
        'product.tags AS tags',
        'product.promotional_text AS promotionalText',
        'product.created_at AS createdAt',
        'product.updated_at AS updatedAt'
      ])
      .from(this.tableName)
      .leftJoin('category', 'category.id', `${this.tableName}.subcategory_id`)
      .where(`${this.tableName}.id`, id)
      .whereNull(`${this.tableName}.deleted_at`)
      .whereNull('category.deleted_at')
      .first();

  getProductsByCollectionId = collectionId =>
    this.knexClient
      .select([
        'product.id AS id',
        'product.name AS name',
        'product.subcategory_id AS subcategoryId',
        'product.description AS description',
        'product.storename AS storename',
        'product.gender AS gender',
        'product.sizechart AS sizechart',
        'product.image AS image',
        'product.tags AS tags',
        'product.promotional_text AS promotionalText',
        'product.created_at AS createdAt',
        'product.updated_at AS updatedAt'
      ])
      .from('collection_product')
      .innerJoin(this.tableName, 'product.id', 'collection_product.product_id')
      .where('collection_product.collection_id', collectionId)
      .whereNull('collection_product.deleted_at')
      .whereNull('product.deleted_at');

  create = ({
    name,
    subcategoryId: subcategory_id = null,
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
        subcategory_id,
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
      subcategoryId: subcategory_id,
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
          subcategory_id,
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
