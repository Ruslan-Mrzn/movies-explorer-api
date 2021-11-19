const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const IncorrectDataError = require('../errors/incorrect-data-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { getSecret } = require('../utils/utils');

const {
  userNotFound,
  incorrectUserData,
  conflictUserEmail,
  incorrectEmptyFields,
  incorrectPassLength,
  incorrectLoginOrPass,
  noticeCookiesCleared,
} = require('../utils/messages');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

module.exports.updateProfile = (req, res, next) => {
  const { user: { _id }, body: { name, email } } = req;

  User.findByIdAndUpdate(_id, { name, email }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он не будет создан (это значение по умолчанию)
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError(incorrectUserData));
        return;
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(conflictUserEmail));
        return;
      }
      if (err.name === 'CastError') {
        next(new IncorrectDataError(incorrectUserData));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password || !name) {
    throw new IncorrectDataError(incorrectEmptyFields);
  }
  if (password.length < 4) {
    throw new IncorrectDataError(incorrectPassLength);
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          const token = jwt.sign({ _id: user._id }, getSecret());
          // отправим токен, браузер сохранит его в куках

          res
            .cookie('jwt', token, {
              // token - наш JWT токен, который мы отправляем
              maxAge: 3600000 * 24 * 7, // кука будет храниться 7 дней
              httpOnly: true, // такую куку нельзя прочесть из JavaScript
              domain: '.nomoredomains.rocks',
              sameSite: 'Lax',
              secure: true,
            })
            .end(); // если у ответа нет тела,можно использовать метод end
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new IncorrectDataError(incorrectUserData));
            return;
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            next(new ConflictError(conflictUserEmail));
            return;
          }
          next(err);
        });
    });
};

module.exports.login = (req, res, next) => {
  const { body: { email, password } } = req;
  // Собственный метод проверки почты и пароля
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, getSecret());
      // отправим токен, браузер сохранит его в куках

      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7, // кука будет храниться 7 дней
          httpOnly: true, // такую куку нельзя прочесть из JavaScript
          domain: '.nomoredomains.rocks',
          sameSite: 'Lax',
          secure: true,
        })
        .end(); // если у ответа нет тела,можно использовать метод end
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError(incorrectLoginOrPass));
        return;
      }
      next(err);
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true, // такую куку нельзя прочесть из JavaScript
    domain: '.nomoredomains.rocks',
    sameSite: 'Lax',
    secure: true,
  }).send({ message: noticeCookiesCleared });
};
