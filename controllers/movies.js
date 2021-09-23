const Movie = require('../models/movie');

const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const {
  incorrectMovieData,
  forbiddenMovieRemove,
  movieNotFound,
  incorrectMovieId,
  conflictMovieId,
  noticeMovieRemoved,
} = require('../utils/messages');

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
        next(new IncorrectDataError(incorrectMovieData));
        return;
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(conflictMovieId));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { params: { id }, user: { _id } } = req;

  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFound);
      }
      if (JSON.stringify(movie.owner) !== JSON.stringify(_id)) {
        throw new ForbiddenError(forbiddenMovieRemove);
      }
      return Movie.findByIdAndRemove(movie._id)
        .then(() => res.send({ message: noticeMovieRemoved }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError(incorrectMovieId));
        return;
      }
      next(err);
    });
};
