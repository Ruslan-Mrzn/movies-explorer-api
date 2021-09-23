const router = require('express').Router();

const {
  validateUserSignup,
  validateUserSignin,
} = require('../middlewares/validation');

const {
  login, createUser, logout,
} = require('../controllers/users');

const { resourceNotFound } = require('../utils/messages');

const NotFoundError = require('../errors/not-found-err');

router.post('/api/signup', validateUserSignup, createUser);

router.post('/api/signin', validateUserSignin, login);

router.use(require('../middlewares/auth'));

router.post('/api/signout', logout);

router.use('/api/users', require('./users'));

router.use('/api/movies', require('./movies'));

router.use('*', () => { throw new NotFoundError(resourceNotFound); });

module.exports = router;
