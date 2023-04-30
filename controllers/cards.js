const Card = require('../models/card');

const ERRORS = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

const checkCard = (card, res) => {
  if (card) {
    return res.send(card);
  }
  return res
    .status(ERRORS.NOT_FOUND)
    .send({ message: 'Карточка не найдена.' });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res
        .status(ERRORS.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере.' });
    });
};

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERRORS.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res
        .status(ERRORS.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере.' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.deleteOne({ _id: cardId })
    .then((card) => {
      if (card.deletedCount === 0) {
        return res
          .status(ERRORS.NOT_FOUND)
          .send({ message: 'Карточка не найдена.' });
      }
      return res.send({ message: 'Карточка удалена.' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERRORS.BAD_REQUEST).send({ message: 'Некорректный id.' });
      }
      return res
        .status(ERRORS.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере.' });
    });
};

const likeCard = (req, res) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } },
    { new: true, runValidators: true }
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERRORS.BAD_REQUEST).send({ message: 'Некорректный id.' });
      }
      return res
        .status(ERRORS.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  const id = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } },
    { new: true, runValidators: true }
  )
    .then((card) => checkCard(card, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERRORS.BAD_REQUEST).send({ message: 'Некорректный id.' });
      }
      return res
        .status(ERRORS.SERVER_ERROR)
        .send({ message: 'Ошибка на сервере.' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
