const validator = require('validator');

const { JWT_SECRET } = process.env;

module.exports.getSecret = () => {
  if (process.env.NODE_ENV === 'production') {
    return JWT_SECRET;
  }
  return 'devMode';
};

module.exports.checkURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('message: введите корректный url-адрес');
  }
  return value;
};

module.exports.checkRuLang = (value) => {
  if (/[A-Za-z]/.test(value)) {
    throw new Error('message: используйте кириллические буквы, любые символы разрешены');
  }
  return value;
};

module.exports.checkEnLang = (value) => {
  if (/[А-ЯЁа-яё]/.test(value)) {
    throw new Error('message: используйте латинские буквы, любые символы разрешены');
  }
  return value;
};
