const { Joi, celebrate } = require('celebrate');
const { URL_REGEXP } = require('../utils/constants');

const userParamsValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const userDescriptionValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(new RegExp(URL_REGEXP)),
  }),
});

module.exports = {
  userParamsValidation,
  userDescriptionValidation,
  userAvatarValidation,
};
