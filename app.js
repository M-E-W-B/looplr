const express = require('express');
const Recaptcha = require('express-recaptcha').RecaptchaV3;
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const knexClient = require('./knex-client');
const config = require('./config');
const mainRouter = require('./routes');
const middlewares = require('./middlewares');

const app = express();
const recaptcha = new Recaptcha(
  config.reCaptcha.siteKey,
  config.reCaptcha.secretKey,
  { callback: 'cb' }
);

// @TODO: use these methods
// recaptcha.middleware.render
// recaptcha.middleware.verify

app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // simulate PUT and DELETE
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/', mainRouter(knexClient, middlewares));

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (process.env.NODE_ENV === 'prod')
    res.status(err.status).json([{ message: err.message }]);
  else res.status(err.status).json([{ message: err.message, data: err.data }]);
});

module.exports = app;
