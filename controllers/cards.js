const { Error } = require('mongoose');
const Card = require('../models/card');
const customError = require('../errors');

const checkCard = (card, res) => {
  if (!card) {
    throw new customError.NotFoundError('Карточка с указанным id не найдена.');
  }
  return res.send(card);
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((error) => {
      if (error instanceof Error.ValidationError) {
        return next(
          new customError.BadRequestError(
            'Переданы некорректные данные при создании новой карточки.',
          ),
        );
      }
      next(error);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new customError.NotFoundError('Карточка с указанным id не найдена.');
      }
      if (card.owner.toString() !== userId) {
        throw new customError.ForbiddenError('Нельзя удалить чужую карточку.');
      }

      card.deleteOne()
        .then(() => {
          res.send({ message: 'Карточка удалена.' });
        })
        .catch(next);
    })
    .catch((error) => {
      if (error instanceof Error.CastError) {
        next(new customError.BadRequestError('Ошибка удаления. Некорректно введён id.'));
      } else {
        next(error);
      }
    });
};

const likeCard = (req, res, next) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error instanceof Error.CastError) {
        next(new customError.BadRequestError('Ошибка постановки лайка. Некорректно введён id'));
      } else {
        next(error);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true },
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error instanceof Error.CastError) {
        return next(new customError.BadRequestError('Ошибка удаления лайка. Некорректно введён id'));
      }
      next(error);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
