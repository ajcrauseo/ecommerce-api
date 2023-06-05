const { Router } = require('express');

const productsRouter = require('./productsRouter');

function routerApi(app) {
  const router = Router();
  app.use('/api', router)
  
  router.use('/products', productsRouter);
}

module.exports = routerApi;
