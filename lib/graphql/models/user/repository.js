const bcrypt = require("bcrypt-nodejs");

class Repository {
  constructor(knexClient) {
    this.knexClient = knexClient;
  }

  getUsers() {
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
      .whereNull("deleted_at")
      .orderBy("created_at", "desc");
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
