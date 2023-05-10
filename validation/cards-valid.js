const { Joi, celebrate } = require('celebrate');
const { URL_REGEXP } = require('../utils/constants');

const cardBodyValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(new RegExp(URL_REGEXP)),
  }),
});

const cardParamsValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  cardBodyValidation,
  cardParamsValidation,
};
