const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { ERROR_CODES } = require('./utils/constants');
const { createUsers, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
}).catch((err) => {
  console.log(`Error: ${err}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', createUsers);
app.post('/signin', login);

app.use(auth);
app.use(router);

app.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({
    message: 'Неправильный путь.',
  });
});

app.listen(PORT, () => {
  console.log(`Start server on port: ${PORT}`);
});
