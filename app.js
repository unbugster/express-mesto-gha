const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const сentralizedErrors = require('./middlewares/errors');
const cors = require('./middlewares/cors');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
}).catch((err) => {
  console.log(`Error: ${err}`);
});

// подключаем логгер запросов
app.use(requestLogger);
// подключаем cors
app.use(cors);

app.use('/', router);

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());
app.use(сentralizedErrors);

app.listen(PORT, () => {
  console.log(`Start server on port: ${PORT}`);
});
