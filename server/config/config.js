require('dotenv').config();

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  production: {
    username: 'rzjphxev',
    password: 'q92INLKzxtqf2Olln-joaLyjWt9LnmVq',
    database: 'rzjphxev',
    host: 'babar.elephantsql.com',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
  }
};

