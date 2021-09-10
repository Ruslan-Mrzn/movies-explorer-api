require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate'); // миддлвар для валидации приходящих на сервер запросов

const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-err');

const { getSecret } = require('./utils/utils');

const {
  login, createUser, logout,
} = require('./controllers/users');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.set('trust proxy', 1);
app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet()); // простановка secutity-заголовков http запросов

app.use(cookieParser(getSecret())); // подключаем парсер кук как мидлвэр

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter); // ограничение кол-ва запросов (защита от DoS-атак)

app.use(cors({ credentials: true, origin: true })); // cors-мидвара

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(require('./middlewares/auth'));

app.post('/signout', logout);

app.use('', require('./routes/index'));

app.use('*', () => { throw new NotFoundError('Ресурс не найден'); });

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// кастомный обработчик ошибок
app.use(require('./middlewares/custom-errors-handler'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}, app mode is ${process.env.NODE_ENV ? 'production' : 'development'}`);
});
