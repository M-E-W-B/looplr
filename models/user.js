const bcrypt = require('bcrypt-nodejs');
const camelCase = require('lodash.camelcase');
const list = require('../utils/list');
const pageInfo = require('../utils/page-info');

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
    this.tableName = 'user';
  }

  getUsers = (pagination, orderings, filters) => {
    const query = this.knexClient
      .select(
        [
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
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
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
      .select(
        [
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
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName)
      .where('id', id)
      .whereNull('deleted_at')
      .first();

  getUserByEmail = email =>
    this.knexClient
      .select(
        [
          'id',
          'first_name',
          'last_name',
          'handle',
          'email',
          'gender',
          'phonenumber',
          'password',
          'about',
          'reset_password_token',
          'reset_password_expires_at',
          'is_active',
          'created_at',
          'updated_at'
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName)
      .where('email', email)
      .whereNull('deleted_at')
      .first();

  getUserByHandle = handle =>
    this.knexClient
      .select(
        [
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
        ].map(i => `${i} AS ${camelCase(i)}`)
      )
      .from(this.tableName)
      .where('handle', handle)
      .whereNull('deleted_at')
      .first();

  generateHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

  matchPassword = (password, encPassword) =>
    bcrypt.compareSync(password, encPassword.toString());

  getFollowers = userId =>
    this.knexClient
      .select([
        'user.id AS id',
        'user.first_name AS firstName',
        'user.last_name AS lastName',
        'user.handle AS handle',
        'user.email AS email',
        'user.gender AS gender',
        'user.phonenumber AS phonenumber',
        'user.about AS about',
        'user.reset_password_token AS resetPasswordToken',
        'user.reset_password_expires_at AS resetPasswordExpiresAt',
        'user.is_active AS isActive',
        'user.created_at AS createdAt',
        'user.updated_at AS updatedAt'
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
        'user.first_name AS firstName',
        'user.last_name AS lastName',
        'user.handle AS handle',
        'user.email AS email',
        'user.gender AS gender',
        'user.phonenumber AS phonenumber',
        'user.about AS about',
        'user.reset_password_token AS resetPasswordToken',
        'user.reset_password_expires_at AS resetPasswordExpiresAt',
        'user.is_active AS isActive',
        'user.created_at AS createdAt',
        'user.updated_at AS updatedAt'
      ])
      .from('follow')
      .innerJoin(this.tableName, 'user.id', 'follow.followed_id')
      .where('follow.follower_id', userId)
      .whereNull('follow.deleted_at')
      .whereNull('user.deleted_at')
      .orderBy('follow.created_at', 'desc');

  create = ({
    firstName: first_name,
    lastName: last_name = null,
    handle = null,
    email,
    gender,
    password,
    phonenumber = null,
    about = null,
    isActive: is_active = 1
  }) =>
    this.knexClient.transaction(async trx => {
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

  update = (
    id,
    { firstName: first_name, lastName: last_name, gender, phonenumber, about }
  ) =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          first_name,
          last_name,
          gender,
          phonenumber,
          about
        })
        .where('id', id)
    );

  followUser = (follower_id, followed_id) =>
    this.knexClient.transaction(trx =>
      trx('follow').insert({
        follower_id,
        followed_id
      })
    );

  unfollowUser = (follower_id, followed_id) =>
    this.knexClient.transaction(trx =>
      trx('follow')
        .update({
          deleted_at: this.knexClient.fn.now()
        })
        .where({ follower_id, followed_id })
    );

  markActive = id =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          is_active: 1
        })
        .where('id', id)
    );

  markInActive = id =>
    this.knexClient.transaction(trx =>
      trx(this.tableName)
        .update({
          is_active: 0
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
