const http2 = require('node:http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = http2.constants;

const User = require('../models/user');

// Получение всех пользователей <><><>
function getUsers(req, res, next) {
  return User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch((err) => {
      next(err);
    });
}
// Получение пользователя по ID <><><>

function getUserId(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundErr('Пользователь по указанному _id не найден.'));
      } else {
        res.status(HTTP_STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

// Получение текущего пользователя<><><>

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

// Создание пользователя +++<><><>
function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(HTTP_STATUS_CREATED).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictErr('Пользователь указанным email уже существует'),
            );
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestErr('Переданы некорректные данные.'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
}

// Обновление профиля пользователя<><><>
function updateUserProfile(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!req.user._id) {
        next(new NotFoundErr('Пользователь c указанным _id не найден.'));
      } else {
        res.status(HTTP_STATUS_OK).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

// Обновление аватара++<><><>
function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!req.user._id) {
        next(new NotFoundErr('Пользователь c указанным _id не найден.'));
      } else {
        res.status(HTTP_STATUS_OK).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
}

// ЛОГИН<><><>
function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token);
      res.send({ jwt: token, data: user }).end();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getCurrentUser,
};
