const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;
const cookies = require("cookie-parser");

const { errors } = require("celebrate");
const { routes } = require("./routes/index");

const auth = require("./middlewares/auth");

const errorHandler = require("./middlewares/error-handler");
// Запуск приложения
const app = express();

// Подключение к базе данных
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

// Middleware объединение пакетов bodynm
app.use(express.json());

app.use(cookies());

// Middleware авторизации, защита следующих роутов
app.use(auth);

app.use(routes);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}...`);
});
