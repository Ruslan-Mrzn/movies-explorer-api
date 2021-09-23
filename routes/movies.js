const router = require('express').Router();

const {
  validateMoviePost,
  validateMovieDelete,
} = require('../middlewares/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', validateMoviePost, createMovie);

router.delete('/:id', validateMovieDelete, deleteMovie);

module.exports = router;
