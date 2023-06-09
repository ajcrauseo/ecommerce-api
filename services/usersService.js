const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const { models } = require('../libs/sequelize');

class UsersService {
  constructor() {}

  async create(data) {
    const user = await models.User.findOne({ where: { email: data.email } });

    if (user) {
      throw boom.badRequest('user exist');
    }

    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({ ...data, password: hash });

    return newUser;
  }

  async findAll() {
    const users = await models.User.findAll({
      attributes: { exclude: ['password', 'recoveryToken'] },
    });

    return users;
  }

  async findById(id) {
    const userById = await models.User.findByPk(id, {
      attributes: { exclude: ['password', 'recoveryToken'] },
    });

    if (!userById) {
      throw boom.notFound('user not found');
    }

    return userById;
  }

  async findByEmail(email) {
    const userByEmail = await models.User.findOne({ where: { email } });

    if (!userByEmail) {
      throw boom.notFound('user not found');
    }

    return userByEmail;
  }

  async updateOne(id, changes) {
    await this.findById(id);

    const [rowsUpdated] = await models.User.update(changes, { where: { id } });

    if (rowsUpdated === 0) {
      throw boom.badRequest('error updating user');
    }

    const userUpdated = await models.User.findByPk(id, {
      attributes: { exclude: ['password', 'recoveryToken'] },
    });

    return userUpdated;
  }

  async deleteOne(id) {
    await this.findById(id);

    await models.User.destroy({ where: { id } });
  }
}

module.exports = UsersService;
