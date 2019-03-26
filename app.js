const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');

const knexClient = require('./knex-client');
const config = require('./config');
const mainRouter = require('./routes');
const authRouter = require('./routes/auth');
const middlewares = require('./middlewares');

const app = express();

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // simulate PUT and DELETE
app.use(cors());

// app.use('/', authRouter(knexClient));
// middlewares(app);
app.use('/', mainRouter(knexClient));

app.use((err, req, res, next) => {
  // error passed should be an array
  if (process.env.NODE_ENV === 'dev') {
    console.error(err.stack);
    res.status(err.status).json({ message: err.message, data: err.data });
  }
});

module.exports = app;
