const { celebrate, Joi } = require('celebrate'); // миддлвар для валидации приходящих на сервер запросов

const {
  checkURL,
  // checkRuLang,
  // checkEnLang,
} = require('../utils/utils');

const validateUserSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
});

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateUserPatch = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});

const validateMoviePost = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(checkURL).required(),
    trailer: Joi.string().custom(checkURL).required(),
    thumbnail: Joi.string().custom(checkURL).required(),
    // id фильма, который содержится в ответе сервиса MoviesExplorer
    // десятичное число
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieDelete = celebrate({
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
});

module.exports = {
  validateUserSignup,
  validateUserSignin,
  validateUserPatch,
  validateMoviePost,
  validateMovieDelete,
};
