const { Sequelize } = require('sequelize');

const config = require('../config');
const setupModels = require('../db/models');

const options = {
  dialect: 'postgres',
};

const sequelize = new Sequelize(
  config.isProd ? config.DB_URL_PRODUCTION : config.DB_URL,
  options,
);

setupModels(sequelize);

module.exports = sequelize;
