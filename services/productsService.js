const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class ProductsService {
  constructor() {}

  async findAll() {
    const products = await models.Product.findAll({ include: ['category'] });

    return products;
  }

  async findById(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category'],
    });

    if (!product) {
      throw boom.notFound('product not found');
    }

    return product;
  }

  async create(data) {
    const newProduct = await models.Product.create(data);

    return newProduct;
  }

  async updateOne(id, changes) {
    await this.findById(id);

    const [rowsUpdated] = await models.Product.update(changes, {
      where: { id },
    });

    if (rowsUpdated === 0) {
      throw boom.badRequest('error updating product');
    }

    const productUpdated = await models.Product.findByPk(id);

    return productUpdated;
  }

  async deleteOne(id) {
    await this.findById(id);

    await models.Product.destroy({ where: { id } });
  }
}

module.exports = ProductsService;
