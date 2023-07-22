const User = require('../models/user');

// Получение всех пользователей ++
function getUsers(req, res) {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      res
        .status(500)
        .send({ message: 'Произошла ошибка в работе сервера', err });
    });
}
// Получение пользователя по ID ++++

function getUserId(req, res) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные ', ...err });
      } else {
        res
          .status(500)
          .send({ message: 'Произошла ошибка в работе сервера', err });
      }
    });
}

// Создание пользователя +++
function createUser(req, res) {
  User.create({ ...req.body })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные', err });
      } else {
        res
          .status(500)
          .send({ message: 'Произошла ошибка в работе сервера', err });
      }
    });
}

// Обновление профиля пользователя
function updateUserProfile(req, res) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (!req.user._id) {
        res
          .status(404)
          .send({ message: 'Пользователь c указанным _id не найден.' });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные', err });
      } else {
        res
          .status(500)
          .send({ message: 'Произошла ошибка в работе сервера', err });
      }
    });
}

// Обновление аватара++
function updateUserAvatar(req, res) {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!req.user._id) {
        res
          .status(404)
          .send({ message: 'Пользователь c указанным _id не найден.' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные', err });
      } else {
        res
          .status(500)
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
