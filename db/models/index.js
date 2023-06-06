const { Category, CategorySchema } = require('./categoryModel');
const { Product, ProductSchema } = require('./productModel');

function setupModels(sequelize) {
  Category.init(CategorySchema, Category.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));

  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
}

module.exports = setupModels;
