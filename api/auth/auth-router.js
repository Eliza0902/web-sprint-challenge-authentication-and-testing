const bcrypt = require('bcryptjs')
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('./users-model.js')
const {checkUserFree} = require('../middleware/checkUserFree')
const {userAndPass} = require('../middleware/userAndPass')
const {validate} = require('../middleware/validate')
const { JWT_SECRET, SALT } = require('./index')

router.post('/register',  userAndPass, checkUserFree, (req, res, next) => {
  const hashedPassword = bcrypt.hashSync(req.newUser.password, SALT);
  const user = { username: req.newUser.username, password: hashedPassword };
  User.insert(user)
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => next(err));
});

router.post('/login', userAndPass, validate, (req, res) => {
  const { password } = req.body;
  const login = bcrypt.compareSync(password.trim(), req.user.password);
  if (login) {
    res.json({
      message: `welcome!`,
      token: generateToken(req.user),
    });
  } else {
    next({ status: 404, message: "invalid credentials" });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = { expiresIn: "1d" };
  return jwt.sign(payload, JWT_SECRET, options);
}


module.exports = router;
