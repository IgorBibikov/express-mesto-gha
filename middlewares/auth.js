const jwt = require('jsonwebtoken');
const UnAuthorizedErr = require('../errors/UnAuthorizedErr');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnAuthorizedErr('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnAuthorizedErr('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
