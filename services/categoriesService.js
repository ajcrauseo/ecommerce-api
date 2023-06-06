const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class CategoriesService {
  constructor() {}

  async findAll() {
    const categories = await models.Category.findAll();

    return categories;
  }

  async findById(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products'],
    });

    if (!category) {
      throw boom.notFound('category not found');
    }

    return category;
  }

  async create(data) {
    const newCategory = await models.Category.create(data);

    return newCategory;
  }

  async updateOne(id, changes) {
    await this.findById(id);

    const [rowsUpdated] = await models.Category.update(changes, {
      where: { id },
    });

    if (rowsUpdated === 0) {
      throw boom.badRequest('error updating category');
    }

    const categoryUpdated = await models.Category.findByPk(id);

    return categoryUpdated;
  }

  async deleteOne(id) {
    await this.findById(id);

    await models.Category.destroy({ where: { id } });
  }
}

module.exports = CategoriesService;
