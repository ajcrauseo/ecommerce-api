const Joi = require('joi');

const id = Joi.number().integer();
const username = Joi.string();
const email = Joi.string().email();
const password = Joi.string().min(6);
const role = Joi.string();

const recoveryToken = Joi.string();

const createUserSchema = Joi.object({
  username: username.required(),
  email: email.required(),
  password: password.required(),
});

const updateUserSchema = Joi.object({
  username,
  password,
  email,
});

const updateUserRoleSchema = Joi.object({
  role: role.required(),
});

const requestRecoverySchema = Joi.object({
  email: email.required(),
});

const changePasswordSchema = Joi.object({
  recoveryToken: recoveryToken.required(),
  password: password.required(),
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateUserRoleSchema,
  requestRecoverySchema,
  changePasswordSchema,
  getUserSchema,
};
