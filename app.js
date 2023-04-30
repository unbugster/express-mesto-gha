const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb').then(() => {
  console.log('Connecting mongo');
}).catch((err) => {
  console.log(`Error: ${err}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use((req, res, next) => {
  req.user = {
    _id: '644d698b3099eb1660ebfa1d'
  };

  next();
});

app.listen(PORT, () => {
  console.log(`Start server on port: ${PORT}`);
});
