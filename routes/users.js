const usersRoutes = require('express').Router();

const {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

//Получение всех пользователей
usersRoutes.get('/', getUsers);

//Получение пользователя по ID
usersRoutes.get('/:userId', getUserId);

//Создание пользователя
usersRoutes.post('/', createUser);

//Обновление профиля пользователя
usersRoutes.patch('/me', updateUserProfile);

//Обновление аватара
usersRoutes.patch('/me/avatar', updateUserAvatar);

module.exports = { usersRoutes };
