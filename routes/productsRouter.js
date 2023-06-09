const { Router } = require('express');
const passport = require('passport');

// Services
const ProductsService = require('../services/productsService');
// Middlewares
const validatorHandler = require('../middlewares/validatorHandler');
const { checkRoles } = require('../middlewares/authorizationHandler');
// Schemas
const {
  getProductSchema,
  createProductSchema,
  updateProductSchema,
} = require('../schemas/productSchema');

// Instance of Router
const router = Router();
// Instance of Service
const productsService = new ProductsService();

// *** PRODUCT ROUTER ***
// Public
// Listar todos los productos
router.get('/', async (req, res, next) => {
  try {
    const products = await productsService.findAll();

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Public
// Obtener un producto por su ID
router.get(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await productsService.findById(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },
);

// Private
// Crear un producto
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const data = req.body;

      const newProduct = await productsService.create(data);

      res.json(newProduct);
    } catch (error) {
      next(error);
    }
  },
);

// Private
// Actualizar un producto
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const productUpdated = await productsService.updateOne(id, data);
      res.json(productUpdated);
    } catch (error) {
      next(error);
    }
  },
);

// Private
// Eliminar un producto
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await productsService.deleteOne(id);
      res.json({ id, message: 'product deleted' });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
