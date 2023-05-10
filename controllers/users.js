const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Error } = require('mongoose');
const User = require('../models/user');
const { ERROR_CODES } = require('../utils/constants');
const customError = require('../errors');

const checkUser = (user, res) => {
  if (!user) {
    throw new customError.NotFound('Нет пользователя с таким id');
  }
  return res.send(user);
};

const getUsers = (req, res, next) => {
  console.log('start getUsers controller');
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUsers = (req, res, next) => {
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
          next(new customError.BadRequestError('Некорректно переданы данные нового пользователя'));
        }
        if (error.code === 11000) {
          next(new customError.ConflictError('Пользователь с таким email уже зарегистрирован'));
        }

        next(error);
      });
  });
};

const getUserById = (req, res, next) => {
  console.log('start getUserById controller');
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => checkUser(user, res))
    .catch((error) => {
      next(error);
    });
};

const editProfile = (req, res, next) => {
  console.log('start editProfile controller');
  const id = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => checkUser(user, res))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  console.log('start updateAvatar controller');
  const id = req.user._id;
  const avatar = req.body;

  User.findByIdAndUpdate(id, avatar, { new: true, runValidators: true })
    .then((user) => checkUser(user, res))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new customError.Unauthorized('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new customError.Unauthorized('Неправильные почта или пароль'));
        }
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });
        return res.send({ token });
      });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  createUsers,
  getUsers,
  getUserById,
  editProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
