const jwt = require('jsonwebtoken');
const customError = require('../errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new customError.UnauthorizedError('Необходима авторизация!'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new customError.UnauthorizedError('Необходима авторизация!'));
  }

  req.user = payload;

  next();
};
