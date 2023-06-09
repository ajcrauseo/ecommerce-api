const { Router } = require('express');
const passport = require('passport');

const AuthService = require('../services/authService');
const validatorHandler = require('../middlewares/validatorHandler');
const {
  createUserSchema,
  requestRecoverySchema,
  changePasswordSchema,
} = require('../schemas/userSchema');

const router = Router();
const authService = new AuthService();

// Login
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      res.json(authService.signToken(req.user));
    } catch (error) {
      next(error);
    }
  },
);

// Sign Up
router.post(
  '/signup',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;

      const userWithToken = await authService.signUp(data);

      res.json(userWithToken);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/recovery',
  validatorHandler(requestRecoverySchema, 'body'),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const response = await authService.sendRecovery(email);

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/change-password',
  validatorHandler(changePasswordSchema, 'body'),
  // TODO: Recibir el token de los query params (?token=eltoken)
  async (req, res, next) => {
    try {
      const { recoveryToken, password } = req.body;

      const response = await authService.changePassword(
        recoveryToken,
        password,
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
