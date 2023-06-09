require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL,
  DB_URL_PRODUCTION: process.env.DB_URL_PRODUCTION,
  API_KEY: process.env.API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_SECRET_RECOVERY: process.env.JWT_SECRET_RECOVERY,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
};

module.exports = config;
