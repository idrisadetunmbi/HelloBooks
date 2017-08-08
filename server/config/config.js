require('dotenv').config();

export default {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'hellobooks-dev',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
};

