const http2 = require('node:http2');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = http2.constants;

const Card = require('../models/card');

// Получение всех карточек<><><>
function getCards(req, res, next) {
  return Card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch((err) => {
      next(err);
    });
}

// Создание карточки++<><><>
function createСard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user;

  return Card.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

// Удаление карточки по ID<><><>
function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Карточка с указанным _id не найдена.'));
      } else if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenErr('У вас нет прав на удаление данной карточки.'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные для удаления карточки.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Установка лайка у карточки<><><>
function setLikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Передан несуществующий _id карточки.'));
      } else {
        res.status(HTTP_STATUS_OK).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные для постановки/снятии лайка.',
          ),
        );
      } else {
        next(err);
      }
    });
}

// Удаление лайка у карточки<><><>
function deleteLikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundErr('Передан несуществующий _id карточки.'));
      } else {
        res.status(HTTP_STATUS_OK).send({ card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequestErr(
            'Переданы некорректные данные для постановки/снятии лайка.',
          ),
        );
      } else {
        next(err);
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
