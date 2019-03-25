class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'image';
  }

  getImages = (entity_id, type) => {
    const query = knexClient
      .select([
        'id',
        'entity_id',
        'type',
        'url',
        'thumbnail_url',
        'description',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

    // @TODO
    if (entity_id) query.where('entity_id', entity_id);
    if (type) query.where('type', type);

    return query;
  };

  getImageById = id =>
    knexClient
      .select([
        'id',
        'entity_id',
        'type',
        'url',
        'thumbnail_url',
        'description',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({
    entity_id,
    type,
    url,
    thumbnail_url = null,
    description = null
  }) =>
    knexClient.transaction(function(trx) {
      return trx(this.tableName).insert({
        entity_id,
        type,
        url,
        thumbnail_url,
        description
      });
    });

  update = (id, { entity_id, type, url, thumbnail_url, description }) =>
    knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          entity_id,
          type,
          url,
          thumbnail_url,
          description
        })
        .where('id', id);
    });

  delete = id =>
    knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where('id', id);
    });
}

module.exports = knexClient => new Repository(knexClient);
