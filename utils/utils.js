const validator = require('validator');

const { JWT_SECRET, MONGODB_ADDRESS } = process.env;

const {
  incorrectUrl,
  incorrectRuLang,
  incorrectEnLang,
} = require('./messages');

module.exports.getSecret = () => {
  if (process.env.NODE_ENV === 'production') {
    return JWT_SECRET;
  }
  return 'devMode';
};

module.exports.getMongoAddress = () => {
  if (process.env.NODE_ENV === 'production') {
    return MONGODB_ADDRESS;
  }
  return 'mongodb+srv://rus_mur:929000@cluster0.21xks.mongodb.net/moviesdb?retryWrites=true&w=majority';
};

module.exports.checkURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error(incorrectUrl);
  }
  return value;
};

module.exports.checkRuLang = (value) => {
  if (/[A-Za-z]/.test(value)) {
    throw new Error(incorrectRuLang);
  }
  return value;
};

module.exports.checkEnLang = (value) => {
  if (/[А-ЯЁа-яё]/.test(value)) {
    throw new Error(incorrectEnLang);
  }
  return value;
};
