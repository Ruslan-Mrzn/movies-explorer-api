const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // миддлвар для валидации приходящих на сервер запросов

const {
  checkURL,
  checkRuLang,
  checkEnLang,
} = require('../utils/utils');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
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
    // пока не будем делать ссылкой на какую-то схему,
    // оставим String
    movieId: Joi.string().required(),
    nameRU: Joi.string().custom(checkRuLang).required(),
    nameEN: Joi.string().custom(checkEnLang).required(),
  }),
}), createMovie);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().required(), // пока оставлю так
  }),
}), deleteMovie);

module.exports = router;
