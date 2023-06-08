const { Router } = require('express');
const passport = require('passport');

// Middlewares
const validatorHandler = require('../middlewares/validatorHandler');
const { checkApiKey } = require('../middlewares/authorizationHandler');

const UsersService = require('../services/usersService');

const {
  updateUserSchema,
  getUserSchema,
  updateUserRoleSchema,
} = require('../schemas/userSchema');

const router = Router();
const userService = new UsersService();

// Get All Users - se necesita API Key
router.get('/', checkApiKey, async (req, res, next) => {
  try {
    const users = await userService.findAll();

    res.json(users)
  } catch (error) {
    next(error);
  }
});

// Obtener 1 usuario
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await userService.findById(id);

      res.json(user);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;

      const userChanged = await userService.updateOne(id, changes);

      res.json(userChanged);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/change-role/:id',
  checkApiKey,
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserRoleSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;

      const roleChanged = await userService.updateOne(id, changes);

      res.json(roleChanged);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  checkApiKey,
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      await userService.deleteOne(id);

      res.json({ id, message: 'user deleted' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
