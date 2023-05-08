const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const User = require('../models/user');
const { ERROR_CODES } = require('../utils/constants');

const checkUser = (user, res) => {
  if (user) {
    return res.send(user);
  }
  return res
    .status(ERROR_CODES.NOT_FOUND)
    .send({ message: 'Запрашиваемый пользователь не найден.' });
};

const getUsers = (req, res) => {
  console.log('start getUsers controller');
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      console.log('Error in getUsers');
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере.' });
    });
};

const createUsers = (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    })
      .then((newUser) => {
        res.status(ERROR_CODES.CREATED).send({
          email: newUser.email,
          name: newUser.name,
          about: newUser.about,
          avatar: newUser.avatar,
        });
      })
      .catch((error) => {
        console.log('Error in createUser');
        if (error instanceof Error.ValidationError) {
          return res.status(ERROR_CODES.BAD_REQUEST).send({
            message: 'Переданы некорректные данные.',
          });
        }
        return res
          .status(ERROR_CODES.SERVER_ERROR)
          .send({ message: 'Ошибка на сервере.' });
      });
  });
};

const getUserById = (req, res) => {
  console.log('start getUserById controller');
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => checkUser(user, res))
    .catch((error) => {
      console.log('Error in getUserById');
      if (error instanceof Error.CastError) {
        return res.status(ERROR_CODES.BAD_REQUEST).send({ message: 'Некорректный id.' });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере.' });
    });
};

const editProfile = (req, res) => {
  console.log('start editProfile controller');
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => checkUser(user, res))
    .catch((error) => {
      console.log('Error in editProfile');
      if (error instanceof Error.ValidationError) {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере.' });
    });
};

const updateAvatar = (req, res) => {
  console.log('start updateAvatar controller');
  const id = req.user._id;
  const avatar = req.body;

  User.findByIdAndUpdate(id, avatar, { new: true, runValidators: true })
    .then((user) => checkUser(user, res))
    .catch((error) => {
      console.log('Error in updateAvatar');
      if (error instanceof Error.ValidationError) {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере.' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ token });
        });
    })
    .catch((err) => {
      res
        .status(ERROR_CODES.UNAUTHORIZED)
        .send({ message: err.message });
    });
};

module.exports = {
  createUsers,
  getUsers,
  getUserById,
  editProfile,
  updateAvatar,
  login,
};
