const { Joi, celebrate } = require('celebrate');
const { URL_REGEXP } = require('../utils/constants');

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(new RegExp(URL_REGEXP)),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

module.exports = {
  signinValidation,
  signupValidation,
};
