const router = require('express').Router();

const { validateUserPatch } = require('../middlewares/validation');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', validateUserPatch, updateProfile);

module.exports = router;
