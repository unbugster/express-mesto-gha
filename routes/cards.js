const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  cardBodyValidation,
  cardParamsValidation,
} = require('../validation/cards-valid');

cardsRouter.get('/', getCards);
cardsRouter.post('/', cardBodyValidation, createCard);
cardsRouter.delete('/:cardId', cardParamsValidation, deleteCard);
cardsRouter.put('/:cardId/likes', cardParamsValidation, likeCard);
cardsRouter.delete('/:cardId/likes', cardParamsValidation, dislikeCard);

module.exports = cardsRouter;
