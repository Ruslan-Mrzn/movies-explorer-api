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

router.post('/signin', validateUserSignup, login);

router.post('/signup', validateUserSignin, createUser);

router.use(require('../middlewares/auth'));

router.post('/signout', logout);

router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

router.use('*', () => { throw new NotFoundError(resourceNotFound); });

module.exports = router;
