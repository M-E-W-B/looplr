const express = require("express");
const graphqlRoutes = require("./lib/graphql/routes");
const bodyParser = require("body-parser");
const cors = require("cors");

const knexClient = require("./lib/knex-client");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

graphqlRoutes(app, knexClient);

module.exports = app;
