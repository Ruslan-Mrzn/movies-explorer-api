const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // миддлвар для валидации приходящих на сервер запросов

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = router;
