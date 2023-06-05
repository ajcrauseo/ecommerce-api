require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  DB_URL_PRODUCTION: process.env.DB_URL_PRODUCTION,
};

module.exports = config;
