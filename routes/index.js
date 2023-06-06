const { Router } = require('express');

const productsRouter = require('./productsRouter');
const categoriesRouter = require('./categoriesRouter');

function routerApi(app) {
  const router = Router();
  app.use('/api', router);

  router.use('/products', productsRouter);
  router.use('/categories', categoriesRouter);
}

module.exports = routerApi;
