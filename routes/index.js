const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const customError = require('../errors');

const {
  login,
  createUsers,
} = require('../controllers/users');

const {
  signinValidation,
  signupValidation,
} = require('../validation/auth-valid');

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUsers);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res, next) => {
  next(new customError.NotFoundError('404: Cтраница не найдена'));
});

module.exports = router;
