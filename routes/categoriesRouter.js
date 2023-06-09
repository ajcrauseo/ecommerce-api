const { Router } = require('express');
const passport = require('passport');

// Services
const CategoriesService = require('../services/categoriesService');
// Middlewares
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authorizationHandler');
// Schemas
const {
  getCategorySchema,
  createCategorySchema,
  updateCategorySchema,
} = require('../schemas/categorySchema');

const router = Router();
const categoriesServices = new CategoriesService();

// Public
// Listar todas las categorias
router.get('/', async (req, res, next) => {
  try {
    const categories = await categoriesServices.findAll();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Public
// Listar categoria por id
router.get(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await categoriesServices.findById(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  },
);

// Prvivate
// Crear una categoria
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;
      const newCategory = await categoriesServices.create(data);
      res.json(newCategory);
    } catch (error) {
      next(error);
    }
  },
);

// Private
// Actualizar una categoria
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const categoryUpdated = await categoriesServices.updateOne(id, data);
      res.json(categoryUpdated);
    } catch (error) {
      next(error);
    }
  },
);

// ELiminar una categoria
// Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await categoriesServices.deleteOne(id);
      res.json({ id, message: 'category deleted' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
