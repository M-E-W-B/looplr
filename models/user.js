const bcrypt = require('bcrypt-nodejs');

const list = require('../utils/list');
const pageInfo = require('../utils/page-info');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'user';
  }

  getUsers = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select([
        'id',
        'first_name',
        'last_name',
        'handle',
        'email',
        'gender',
        'phonenumber',
        'about',
        'reset_password_token',
        'reset_password_expires_at',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName);

    query.joinRaw('where ?? is null', [`${this.tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, this.tableName);
  };

  getPageInfo = (pagination, orderings, filters) => {
    const query = this.getUsers(null, orderings, filters);
    return pageInfo(pagination, query);
  };

  getUserById = id =>
    this.knexClient
      .select([
        'id',
        'first_name',
        'last_name',
        'handle',
        'email',
        'gender',
        'phonenumber',
        'about',
        'reset_password_token',
        'reset_password_expires_at',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  getUserByEmail = email =>
    this.knexClient
      .select([
        'id',
        'first_name',
        'last_name',
        'handle',
        'email',
        'gender',
        'phonenumber',
        'about',
        'reset_password_token',
        'reset_password_expires_at',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('email', email)
      .whereNull('deleted_at')
      .first();

  getUserByHandle = handle =>
    this.knexClient
      .select([
        'id',
        'first_name',
        'last_name',
        'handle',
        'email',
        'gender',
        'phonenumber',
        'about',
        'reset_password_token',
        'reset_password_expires_at',
        'is_active',
        'created_at',
        'updated_at'
      ])
      .from(this.tableName)
      .where('handle', handle)
      .whereNull('deleted_at')
      .first();

  generateHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

  matchPassword = (password, encPassword) =>
    bcrypt.compareSync(password, encPassword);

  getFollowers = userId =>
    this.knexClient
      .select([
        'user.id AS id',
        'user.first_name AS first_name',
        'user.last_name AS last_name',
        'user.handle AS handle',
        'user.email AS email',
        'user.gender AS gender',
        'user.phonenumber AS phonenumber',
        'user.about AS about',
        'user.reset_password_token AS reset_password_token',
        'user.reset_password_expires_at AS reset_password_expires_at',
        'user.is_active AS is_active',
        'user.created_at AS created_at',
        'user.updated_at AS updated_at '
      ])
      .from('follow')
      .innerJoin(this.tableName, 'user.id', 'follow.followed_id')
      .where('follow.followed_id', userId)
      .whereNull('follow.deleted_at')
      .whereNull('user.deleted_at')
      .orderBy('follow.created_at', 'desc');

  getFollowings = userId =>
    this.knexClient
      .select([
        'user.id AS id',
        'user.first_name AS first_name',
        'user.last_name AS last_name',
        'user.handle AS handle',
        'user.email AS email',
        'user.gender AS gender',
        'user.phonenumber AS phonenumber',
        'user.about AS about',
        'user.reset_password_token AS reset_password_token',
        'user.reset_password_expires_at AS reset_password_expires_at',
        'user.is_active AS is_active',
        'user.created_at AS created_at',
        'user.updated_at AS updated_at '
      ])
      .from('follow')
      .innerJoin(this.tableName, 'user.id', 'follow.followed_id')
      .where('follow.follower_id', userId)
      .whereNull('follow.deleted_at')
      .whereNull('user.deleted_at')
      .orderBy('follow.created_at', 'desc');

  create = ({
    first_name,
    last_name = null,
    handle = null,
    email,
    gender,
    password,
    phonenumber = null,
    about = null,
    is_active = 1
  }) =>
    this.knexClient.transaction(async function(trx) {
      const [id] = await trx('entity').insert({ id: null });
      await trx(this.tableName).insert({
        id,
        first_name,
        last_name,
        handle,
        email,
        password: this.generateHash(password),
        gender,
        phonenumber,
        about,
        reset_password_token: null,
        reset_password_expires_at: null,
        is_active
      });

      return id;
    });

  update = (id, { first_name, last_name, gender, phonenumber, about }) =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          first_name,
          last_name,
          gender,
          phonenumber,
          about
        })
        .where('id', id);
    });

  followUser = (user_id, to_follow_user_id) =>
    this.knexClient.transaction(function(trx) {
      return trx('follow').insert({
        follower_id: user_id,
        followed_id: to_follow_user_id
      });
    });

  unfollowUser = (user_id, to_unfollow_user_id) =>
    this.knexClient.transaction(function(trx) {
      return trx('follow')
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where({ follower_id: user_id, followed_id: to_unfollow_user_id });
    });

  markActive = id =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          is_active: 1
        })
        .where('id', id);
    });

  markInActive = id =>
    this.knexClient.transaction(function(trx) {
      return trx(this.tableName)
        .update({
          is_active: 0
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
