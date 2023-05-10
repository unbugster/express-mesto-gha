const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const router = require('./routes');
const сentralizedErrors = require('./middlewares/errors');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
}).catch((err) => {
  console.log(`Error: ${err}`);
});

app.use('/', router);
app.use(errors());
app.use(сentralizedErrors);

app.listen(PORT, () => {
  console.log(`Start server on port: ${PORT}`);
});
