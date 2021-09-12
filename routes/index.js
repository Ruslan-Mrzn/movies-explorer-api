const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // миддлвар для валидации приходящих на сервер запросов

const NotFoundError = require('../errors/not-found-err');

const {
  login, createUser, logout,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use(celebrate({
  cookies: Joi.object().keys({
    jwt: Joi.string().required(), // возможно еще что-то нужно будет проверить
  }),
}), require('../middlewares/auth'));

router.post('/signout', logout);

router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

router.use('*', () => { throw new NotFoundError('Ресурс не найден'); });

module.exports = router;
