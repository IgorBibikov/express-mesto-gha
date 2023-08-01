const usersRoutes = require('express').Router();

const {
  getUsers,
  getUserId,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  ValidationGetUserId,
  ValidationUpdateUserProfile,
  ValidationUpdateUserAvatar,
} = require('../middlewares/validation');

// Получение всех пользователей
usersRoutes.get('/', getUsers);

// Получение текущего пользователя
usersRoutes.get('/me', getCurrentUser);

// Получение пользователя по ID
usersRoutes.get('/:userId', ValidationGetUserId, getUserId);

// Обновление профиля пользователя
usersRoutes.patch('/me', ValidationUpdateUserProfile, updateUserProfile);

// Обновление аватара
usersRoutes.patch('/me/avatar', ValidationUpdateUserAvatar, updateUserAvatar);

module.exports = { usersRoutes };
