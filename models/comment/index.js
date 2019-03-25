class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'comment';
  }

  getComments = () =>
    this.knexClient
      .select([
        'id',
        'user_id',
        'entity_id',
        'rating',
        'txt',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getCommentsByUserId = userId =>
    this.knexClient
      .select([
        'id',
        'user_id',
        'entity_id',
        'rating',
        'txt',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('user_id', userId)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getCommentsOn = entityId =>
    this.knexClient
      .select([
        'id',
        'user_id',
        'entity_id',
        'rating',
        'txt',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('entity_id', entityId)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getCommentById = id =>
    this.knexClient
      .select([
        'id',
        'user_id',
        'entity_id',
        'rating',
        'txt',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({ user_id, entity_id, rating = null, txt }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName).insert({
        user_id,
        entity_id,
        rating,
        txt
      });
    });

  update = (id, { rating, txt }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          rating,
          txt
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
