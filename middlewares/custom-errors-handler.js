const { serverError } = require('../utils/messages');

module.exports = ((err, req, res, next) => { // наш централизованный обработчик
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? serverError
        : message,
    });
  next();
});
