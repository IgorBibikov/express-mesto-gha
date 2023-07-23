const http2 = require('node:http2');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const Card = require('../models/card');

// Получение всех карточек
function getCards(req, res) {
  return Card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch((err) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка в работе сервера' }, err);
    });
}

// Создание карточки++
function createСard(req, res) {
  const { name, link } = req.body;
  const owner = req.user;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные ' });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка в работе сервера' });
      }
    });
}

// Удаление карточки по ID
function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для удаления карточки',
          err,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка в работе сервера' });
      }
    });
}

// Установка лайка у карточки
function setLikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(HTTP_STATUS_OK).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка',
          err,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка в работе сервера' });
      }
    });
}

// Удаление лайка у карточки
function deleteLikeCard(req, res) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(HTTP_STATUS_OK).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка',
          err,
        });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка в работе сервера' });
      }
    });
}

module.exports = {
  getCards,
  createСard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
};
