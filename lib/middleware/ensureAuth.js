const User = require('../models/User');

const userPasswordReader = authorization => {
  const [username, password] = Buffer
    .from(authorization.split(' ')[1], 'base64')
    .toString()
    .split(':');
  return { username, password };
};

const verify = (req, res, next) => {
  const { username, password } = userPasswordReader(req.headers.authorization);

  User
    .authorizeUser(username, password)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};

module.exports = {
  userPasswordReader,
  verify
};
