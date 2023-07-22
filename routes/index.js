const express = require('express');

const routes = express.Router();
const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);

routes.use('/', (req, res, next) => {
  next(res.status(404).send({ message: 'Неверный путь' }));
});

module.exports = { routes };
