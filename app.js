const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const { routes } = require('./routes/index');
// Запуск приложения
const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '64b93c11fa608b577900b998',
  };

  next();
});
// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

// Middleware объединение пакетов bodynm
app.use(express.json());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}...`);
});
