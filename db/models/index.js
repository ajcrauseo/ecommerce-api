const { Product, ProductSchema } = require('./productModel');

function setupModels(sequelize) {
  Product.init(ProductSchema, Product.config(sequelize));

  // TODO: crear asociaciones
  // Product.associate(sequelize.models)
}

module.exports = setupModels;
