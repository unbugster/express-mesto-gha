const usersRouter = require('express').Router();
const { createUser, getUsers, getUserById, editProfile, updateAvatar } = require('../controllers/users');

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', editProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
