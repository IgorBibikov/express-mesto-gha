const http2 = require('node:http2');
const express = require('express');

const routes = express.Router();

const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');

const { HTTP_STATUS_NOT_FOUND } = http2.constants;

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);

routes.use('/', (req, res, next) => {
  next(res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Неверный путь' }));
});

module.exports = { routes };
