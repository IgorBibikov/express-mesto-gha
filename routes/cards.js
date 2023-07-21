const cardsRoutes = require('express').Router();

const {
  getCards,
  createСard,
  deleteCard,
  setLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

//Получение всех карточек
cardsRoutes.get('/', getCards);

//Создание карточки
cardsRoutes.post('/', createСard);

//Удаление карточки по ID
cardsRoutes.delete('/:cardId', deleteCard);

//Установка лайка у карточки
cardsRoutes.put('/:cardId/likes', setLikeCard);

//Удаление лайка у карточки
cardsRoutes.delete('/:cardId/likes', deleteLikeCard);

module.exports = { cardsRoutes };
