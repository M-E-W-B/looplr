const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const knexClient = require('./knex-client');
const config = require('./config');
const mainRouter = require('./routes');
const authRouter = require('./routes/auth');
const middlewares = require('./middlewares');

const app = express();

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // simulate PUT and DELETE
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/', authRouter(knexClient));
if (process.env.NODE_ENV !== 'test') middlewares(app);
app.use('/', mainRouter(knexClient));

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (process.env.NODE_ENV === 'dev')
    res.status(err.status).json([{ message: err.message, data: err.data }]);
  else res.status(err.status).json([{ message: err.message }]);
});

module.exports = app;
