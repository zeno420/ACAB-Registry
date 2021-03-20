const env = require('./secrets');

const config = {
  db: { /* set env vars accordingly */
    host: env.host || 'localhost',
    user: env.user,
    password: env.password,
    database: env.database,
  },
  listPerPage: env.list_per_page || 10,
  secret: env.secret,
};

module.exports = config;
