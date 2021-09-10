const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // миддлвар для валидации приходящих на сервер запросов

const {
  checkURL,
  checkRuLang,
  checkEnLang,
} = require('../utils/utils');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

router.get('/movies', getMovies);

router.post('/movies', celebrate({
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

router.delete('/movies/:id', deleteMovie);

module.exports = router;
