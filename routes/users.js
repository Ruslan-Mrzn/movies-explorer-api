const router = require('express').Router();
// миддлвар для валидации приходящих на сервер запросов
// const { celebrate, Joi } = require('celebrate');

const { validateUserPatch } = require('../middlewares/validation');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', validateUserPatch,
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().min(2).max(30).required(),
  //     email: Joi.string().required().email(),
  //   }),
  // }),
  updateProfile);

module.exports = router;
