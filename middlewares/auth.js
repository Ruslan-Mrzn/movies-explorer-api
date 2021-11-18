const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');

const { getSecret } = require('../utils/utils');

const { unauthorized } = require('../utils/messages');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie) {
    throw new UnauthorizedError(unauthorized);
  }

  const token = cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, getSecret());
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
