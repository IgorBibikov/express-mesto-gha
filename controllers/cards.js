const Card = require('../models/card');

// Получение всех карточек
function getCards(req, res) {
  return Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'Произошла ошибка в работе сервера' }, err);
    });
}

// Создание карточки++
function createСard(req, res) {
  const { name, link } = req.body;
  const owner = req.user;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные ' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка в работе сервера' });
      }
    });
}

// Удаление карточки по ID
function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'Произошла ошибка в работе сервера' }, err);
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
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(200).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка в работе сервера' });
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
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(200).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка в работе сервера' });
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
