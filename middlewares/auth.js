const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const { hidePassword } = User;
const UnauthorizedError = require('../errors/unauthorized-err');

const { getSecret } = require('../utils/utils');

const { unauthorized } = require('../utils/messages');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new UnauthorizedError(unauthorized);
  }

  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, getSecret());
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new UnauthorizedError(unauthorized));
      return;
    }
    next(err);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
