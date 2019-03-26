const knex = require('knex');
const { host, user, password, database } = require('./config');

const client = knex({
  client: 'mysql',
  connection: {
    host,
    user,
    password,
    database,
    namedPlaceholders: true,
    rowsAsArray: false,
    timezone: 'UTC'
  }
});

module.exports = client;
