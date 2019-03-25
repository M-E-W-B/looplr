const bcrypt = require("bcrypt-nodejs");
const list = require("../../utils/list");
const pageInfo = require("../../utils/page-info");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getUsers(pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "user";

    const query = knexClient
      .select([
        "id",
        "first_name",
        "last_name",
        "handle",
        "email",
        "gender",
        "phonenumber",
        "about",
        "reset_password_token",
        "reset_password_expires_at",
        "is_active",
        "created_at",
        "updated_at"
      ])
      .from(tableName);

    query.joinRaw("where ?? is null", [`${tableName}.deleted_at`]);

    return list(pagination, orderings, filters, query, tableName);
  }

  getPageInfo(pagination, orderings, filters) {
    const query = this.getUsers(null, orderings, filters);
    return pageInfo(pagination, query);
  }

  getUserById(id) {
    const knexClient = this.knexClient;
    return knexClient
      .select([
        "id",
        "first_name",
        "last_name",
        "handle",
        "email",
        "gender",
        "phonenumber",
        "about",
        "reset_password_token",
        "reset_password_expires_at",
        "is_active",
        "created_at",
        "updated_at"
      ])
      .from("user")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  matchPassword(password, encPassword) {
    return bcrypt.compareSync(password, encPassword);
  }

  getFollowers(userId, pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "user";

    const query = knexClient
      .select([
        "user.id AS id",
        "user.first_name AS first_name",
        "user.last_name AS last_name",
        "user.handle AS handle",
        "user.email AS email",
        "user.gender AS gender",
        "user.phonenumber AS phonenumber",
        "user.about AS about",
        "user.reset_password_token AS reset_password_token",
        "user.reset_password_expires_at AS reset_password_expires_at",
        "user.is_active AS is_active",
        "user.created_at AS created_at",
        "user.updated_at AS updated_at "
      ])
      .from("follow")
      .innerJoin("user", "user.id", "follow.followed_id");

    query.joinRaw(
      "where follow.followed_id = ? and user.deleted_at is null and follow.deleted_at is null",
      [userId]
    );

    return list(pagination, orderings, filters, query, tableName);
  }

  getFollowings(userId, pagination, orderings, filters) {
    const knexClient = this.knexClient;
    const tableName = "user";

    const query = knexClient
      .select([
        "user.id AS id",
        "user.first_name AS first_name",
        "user.last_name AS last_name",
        "user.handle AS handle",
        "user.email AS email",
        "user.gender AS gender",
        "user.phonenumber AS phonenumber",
        "user.about AS about",
        "user.reset_password_token AS reset_password_token",
        "user.reset_password_expires_at AS reset_password_expires_at",
        "user.is_active AS is_active",
        "user.created_at AS created_at",
        "user.updated_at AS updated_at "
      ])
      .from("follow")
      .innerJoin("user", "user.id", "follow.followed_id");

    query.joinRaw(
      "where follow.follower_id = ? and user.deleted_at is null and follow.deleted_at is null",
      [userId]
    );

    return list(pagination, orderings, filters, query, tableName);
  }

  create({
    first_name,
    last_name = null,
    handle = null,
    email,
    gender,
    password,
    phonenumber = null,
    about = null,
    is_active = 1
  }) {
    const knexClient = this.knexClient;
    const encPassword = this.generateHash(password);

    return knexClient.transaction(async function(trx) {
      const [id] = await trx("entity").insert({ id: null });
      await trx("user").insert({
        id,
        first_name,
        last_name,
        handle,
        email,
        password: encPassword,
        gender,
        phonenumber,
        about,
        reset_password_token: null,
        reset_password_expires_at: null,
        is_active
      });

      return id;
    });
  }

  update(id, { first_name, last_name, gender, phonenumber, about }) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("user")
        .update({
          first_name,
          last_name,
          gender,
          phonenumber,
          about
        })
        .where("id", id);
    });
  }

  followUser(user_id, to_follow_user_id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("follow").insert({
        follower_id: user_id,
        followed_id: to_follow_user_id
      });
    });
  }

  unfollowUser(user_id, to_unfollow_user_id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("follow")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where({ follower_id: user_id, followed_id: to_unfollow_user_id });
    });
  }

  markActive(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("user")
        .update({
          is_active: 1
        })
        .where("id", id);
    });
  }

  markInActive(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("user")
        .update({
          is_active: 0
        })
        .where("id", id);
    });
  }

  delete(id) {
    const knexClient = this.knexClient;
    return knexClient.transaction(function(trx) {
      return trx("user")
        .update({
          deleted_at: knexClient.fn.now()
        })
        .where("id", id);
    });
  }
}

module.exports = knexClient => new Repository(knexClient);
