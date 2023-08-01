const { celebrate, Joi } = require("celebrate");
const regexp = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;
// Валидация создания пользователя

const ValidationСreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).pattern(regexp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

// Валидация логина пользователя

const ValidationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

// Валидация получения пользователя по ID
const ValidationGetUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  }),
});

// Валидация обновления профиля пользователя

const ValidationUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

// Валидация обновления аватара

const ValidationUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).pattern(regexp),
  }),
});

// Валидация создания карточки

const ValidationCreateСard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().min(2).required().pattern(regexp),
  }),
});

// Валидация удаления карточки по ID

const ValidationDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});

// Валидация установки лайка у карточки

const ValidationSetLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});
// Валидация удаления у карточки

const ValidationDeleteLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
});

module.exports = {
  ValidationСreateUser,
  ValidationLogin,
  ValidationGetUserId,
  ValidationUpdateUserProfile,
  ValidationUpdateUserAvatar,
  ValidationCreateСard,
  ValidationDeleteCard,
  ValidationSetLikeCard,
  ValidationDeleteLikeCard,
};
