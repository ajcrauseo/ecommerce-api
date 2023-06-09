const { Sequelize } = require('sequelize');

const config = require('../config');
const setupModels = require('../db/models');

const options = {
  dialect: 'postgres',
  logging: config.isProd ? false : (message) => {
    console.log(`Sequelize log: ${message}`);
  },
};

if (config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(
  config.isProd ? config.DB_URL_PRODUCTION : config.DB_URL,
  options,
);

setupModels(sequelize);

module.exports = sequelize;
