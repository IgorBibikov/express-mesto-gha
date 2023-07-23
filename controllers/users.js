const http2 = require('node:http2');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = http2.constants;

const User = require('../models/user');

// Получение всех пользователей ++
function getUsers(req, res) {
  return User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch((err) => {
      res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Произошла ошибка в работе сервера', err });
    });
}
// Получение пользователя по ID ++++

function getUserId(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(HTTP_STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные ', ...err });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка в работе сервера', err });
      }
    });
}

// Создание пользователя +++
function createUser(req, res) {
  User.create({ ...req.body })
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные', err });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка в работе сервера', err });
      }
    });
}

// Обновление профиля пользователя
function updateUserProfile(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!req.user._id) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь c указанным _id не найден.' });
      } else {
        res.status(HTTP_STATUS_OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные', err });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка в работе сервера', err });
      }
    });
}

// Обновление аватара++
function updateUserAvatar(req, res) {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!req.user._id) {
        res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Пользователь c указанным _id не найден.' });
      } else {
        res.status(HTTP_STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные', err });
      } else {
        res
          .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: 'Произошла ошибка в работе сервера', err });
      }
    });
}

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
