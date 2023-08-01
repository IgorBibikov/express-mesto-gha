const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const cookies = require('cookie-parser');
const http2 = require('node:http2');
const { routes } = require('./routes/index');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = http2.constants;

const {
  ValidationСreateUser,
  ValidationLogin,
} = require('./middlewares/validation');
// Запуск приложения
const app = express();

// app.use((req, res, next) => {
//   req.user = {
//     _id: "64b93c11fa608b577900b998",
//   };

//   next();
// });

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

// Middleware объединение пакетов bodynm
app.use(express.json());

app.use(cookies());

app.post('/signin', ValidationLogin, login);

app.post('/signup', ValidationСreateUser, createUser);

// Middleware авторизации, защита следующих роутов
app.use(auth);

app.use(routes);

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Произошла ошибка в работе сервера', err });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}...`);
});
