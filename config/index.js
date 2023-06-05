require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT,
  DB_URL_PRODUCTION: process.env.DB_URL_PRODUCTION,
};

module.exports = config;
