const boom = require('@hapi/boom');

const config = require('../config');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['apikey'];

  if (apiKey === config.API_KEY) {
    next();
  } else {
    next(boom.unauthorized('invalid api key'));
  }
}

function checkRoles(...roles) {
  return (req, res, next) => {
    const { user } = req;

    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.unauthorized('invalid role'));
    }
  };
}

// Use example
// checkRoles('admin', 'user', 'otherRole')

module.exports = { checkApiKey, checkRoles };
