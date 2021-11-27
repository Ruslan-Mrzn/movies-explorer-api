require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate'); // миддлвар для валидации приходящих на сервер запросов
const { limiter } = require('./middlewares/rate-limiter-config'); // ограничение числа запросов в едницу времени
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { getSecret, getMongoAddress } = require('./utils/utils'); // вспомогательные кастомные утилиты

const app = express();

app.set('trust proxy', 1); // т.к. используем обратный nginx-прокси
app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect(getMongoAddress(), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter); // ограничение кол-ва запросов (защита от DoS-атак)

app.use(helmet()); // простановка security-заголовков http запросов

app.use(cors({ credentials: true, origin: true, exposedHeaders: ['*', 'Authorization'] })); // cors-мидвара

app.use(cookieParser(getSecret())); // подключаем парсер кук как мидлвэр

app.use(require('./routes/index')); // роуты приложения подключены в одном файле

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// кастомный обработчик ошибок
app.use(require('./middlewares/custom-errors-handler'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}, app mode is ${process.env.NODE_ENV}`);
});
