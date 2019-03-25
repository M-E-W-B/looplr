class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'product';
  }

  getProducts = () =>
    this.knexClient
      .select([
        'id',
        'name',
        'category',
        'subcategory',
        'description',
        'storename',
        'gender',
        'tags',
        'promotional_text',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getProductsByCollectionId = id =>
    this.knexClient
      .select([
        'product.id AS id',
        'product.name AS name',
        'product.category AS category',
        'product.subcategory AS subcategory',
        'product.description AS description',
        'product.storename AS storename',
        'product.gender AS gender',
        'product.tags AS tags',
        'product.promotional_text AS promotional_text',
        'product.created_at AS created_at',
        'product.updated_at AS updated_at'
      ])
      .from('collection_product')
      .innerJoin(this.tableName, 'product.id', 'collection_product.product_id')
      .where('collection_product.collection_id', id)
      .whereNull('collection_product.deleted_at')
      .whereNull('product.deleted_at')
      .orderBy('collection_product.created_at', 'desc');

  getFullProducts = () => {
    const productSkuPromise = knexClient
      .select([
        'product.id AS id',
        'product.name AS name',
        'product.category AS',
        'product.subcategory AS subcategory',
        'product.description AS description',
        'product.storename AS storename',
        'product.gender AS gender',
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
      .whereNull('product.deleted_at')
      .whereNull('sku.deleted_at')
      .whereNull('color.deleted_at')
      .whereNull('size.deleted_at')
      .orderBy('sku.created_at', 'desc');

    const productImagePromise = knexClient
      .select([
        'product.id AS id',
        'image.type',
        'image.url',
        'image.thumbnail_url'
      ])
      .from(this.tableName)
      .leftJoin('image', 'image.entity_id', 'product.id')
      .whereNull('product.deleted_at')
      .whereNull('image.deleted_at')
      .orderBy('image.created_at', 'desc');

    return Promise.all([productSkuPromise, productImagePromise]);
  };

  getFullProductById(id) {}

  getProductById = id =>
    this.knexClient
      .select([
        'id',
        'name',
        'category',
        'subcategory',
        'description',
        'storename',
        'gender',
        'tags',
        'promotional_text',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    name,
    category = null,
    subcategory = null,
    description = null,
    storename = null,
    gender = 'U',
    tags = null,
    promotional_text = null
  }) =>
    this.knexClient.transaction(async function(trx) {
      const [id] = await trx('entity').insert({ id: null });
      await trx(this.tableName).insert({
        id,
        name,
        category,
        subcategory,
        description,
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
      storename,
      gender,
      tags,
      promotional_text
    }
  ) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          name,
          category,
          subcategory,
          description,
          storename,
          gender,
          tags,
          promotional_text
        })
        .where('id', id);
    });

  delete =
    id >
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where('id', id);
    });
}

module.exports = knexClient => new Repository(knexClient);
