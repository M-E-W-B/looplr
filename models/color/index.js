class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'color';
  }

  getColors = () =>
    this.knexClient
      .select(['id', 'hexcode', 'created_at', 'updated_at'])
      .from(this.tableName)
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

  getColorById = id =>
    this.knexClient
      .select(['id', 'hexcode', 'created_at', 'updated_at'])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  create = ({ hexcode }) =>
    this.knexClient.transaction(async function(trx) {
      const [id] = await trx('sku_attribute').insert({ id: null });
      await trx(this.tableName).insert({
        id,
        hexcode
      });

      return id;
    });

  update = (id, { hexcode }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          hexcode
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
