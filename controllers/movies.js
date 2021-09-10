const Movie = require('../models/movie');

const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    user: { _id },
    body: {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    },
  } = req;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: _id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Ошибка! Переданы некорректные данные при создании карточки фильма'));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { params: { id }, user: { _id } } = req;

  Movie.findOne({ movieId: `${id}` })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }
      if (JSON.stringify(movie.owner) !== JSON.stringify(_id)) {
        throw new ForbiddenError('Вы можете удалять только свои фильмы');
      }
      Movie.findByIdAndRemove(movie._id)
        .then((myMovie) => res.send(myMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Невалидный id фильма'));
      }
      next(err);
    });
};
