const usersRouter = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  editProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  userParamsValidation,
  userDescriptionValidation,
  userAvatarValidation,
} = require('../validation/users-valid');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', userParamsValidation, getUserById);
usersRouter.patch('/me', userDescriptionValidation, editProfile);
usersRouter.patch('/me/avatar', userAvatarValidation, updateAvatar);

module.exports = usersRouter;
