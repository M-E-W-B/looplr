class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'badge';
  }

  getBadges = () =>
    this.knexClient
      .select(['id', 'name', 'description', 'created_at', 'updated_at'])
      .from(this.tableName)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getBadgeById = id =>
    this.knexClient
      .select(['id', 'name', 'description', 'created_at', 'updated_at'])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({ name, description = null }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName).insert({
        id,
        name,
        description
      });
    });

  update = (id, { name, description }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          name,
          description
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
