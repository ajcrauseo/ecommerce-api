const { Router } = require('express');

const CategoriesService = require('../services/categoriesService');
const validatorHandler = require('../middlewares/validatorHandler');
const {
  getCategorySchema,
  createCategorySchema,
  updateCategorySchema,
} = require('../schemas/categorySchema');

const router = Router();
const categoriesServices = new CategoriesService();

// Listar todas las categorias
router.get('/', async (req, res, next) => {
  try {
    const categories = await categoriesServices.findAll();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

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

// Crear una categoria
router.post(
  '/',
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

// Actualizar una categoria
router.patch(
  '/:id',
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
router.delete(
  '/:id',
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
