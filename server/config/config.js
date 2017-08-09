const dotenv = require('dotenv');

dotenv.config({
  path: __dirname + '/../../.env'
});

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  production: {
    username: 'rzjphxev',
    password: 'q92INLKzxtqf2Olln-joaLyjWt9LnmVq',
    database: 'rzjphxev',
    host: 'babar.elephantsql.com',
    protocol: 'postgres',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  }
};

