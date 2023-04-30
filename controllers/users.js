const User = require('../models/user');

const createUser = (req, res) => {
  console.log('start createUser controller');
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((error) => {
      console.log('Error in createUser');
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: `Error: ${error}` });
      } else {
        res.status(500).send({ message: `Error: ${error}` });
      }
    });
};

const getUsers = (req, res) => {
  console.log('start getUsers controller');
  User.find()
    .then((user) => res.send(user))
    .catch((error) => {
      console.log('Error in getUsers');
      res.status(500).send({ message: `Error: ${error}` });
    });
};

const getUserById = (req, res) => {
  console.log('start getUserById controller');
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      console.log('Error in getUserById');
      if (error.name === 'CastError') {
        res.status(404).send({ message: `Error: ${error}` });
      } else {
        res.status(500).send({ message: `Error: ${error}` });
      }
    });
};

const editProfile = (req, res) => {
  console.log('start editProfile controller');
  const { id } = req.user;
  const { name = res.name, about = res.about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      console.log('Error in editProfile');
      if (error.name === 'CastError') {
        res.status(404).send({ message: `Error: ${error}` });
      } else {
        res.status(500).send({ message: `Error: ${error}` });
      }
    });
};

const updateAvatar = (req, res) => {
  console.log('start updateAvatar controller');
  const { id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, }
  )
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      console.log('Error in updateAvatar');
      res.status(500).send({ message: `Error: ${error}` });
    });
};

module.exports = { createUser, getUsers, getUserById, editProfile, updateAvatar };
