const cardsRoutes = require('express').Router();

const {
  getCards,
  createСard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');
const {
  ValidationCreateСard,
  ValidationDeleteCard,
  ValidationSetLikeCard,
  ValidationDeleteLikeCard,
} = require('../middlewares/validation');

// Получение всех карточек
cardsRoutes.get('/', getCards);

// Создание карточки
cardsRoutes.post('/', ValidationCreateСard, createСard);

// Удаление карточки по ID
cardsRoutes.delete('/:cardId', ValidationDeleteCard, deleteCard);

// Установка лайка у карточки
cardsRoutes.put('/:cardId/likes', ValidationSetLikeCard, setLikeCard);

// Удаление лайка у карточки
cardsRoutes.delete('/:cardId/likes', ValidationDeleteLikeCard, deleteLikeCard);

module.exports = { cardsRoutes };
