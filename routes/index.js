const express = require('express');
const NotFoundErr = require('../errors/NotFoundErr');
const auth = require('../middlewares/auth');

const routes = express.Router();
const {
  ValidationСreateUser,
  ValidationLogin,
} = require('../middlewares/validation');

const { login, createUser } = require('../controllers/users');

const { usersRoutes } = require('./users');
const { cardsRoutes } = require('./cards');

routes.post('/signin', ValidationLogin, login);

routes.post('/signup', ValidationСreateUser, createUser);

routes.use('/users', auth, usersRoutes);
routes.use('/cards', auth, cardsRoutes);

routes.use('/', (req, res, next) => {
  next(new NotFoundErr('Неверный путь.'));
});

module.exports = { routes };
