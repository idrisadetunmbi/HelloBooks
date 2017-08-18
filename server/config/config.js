const dotenv = require('dotenv');

dotenv.config({
  path: __dirname + '/../../.env'
});

module.exports = {
  development: {
    use_env_variable: 'DEV_DATABASE_URL',
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
    use_env_variable: 'TEST_DATABASE_URL',
    dialect: 'postgres'
  }
};

