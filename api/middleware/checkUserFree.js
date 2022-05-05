const User = require('../auth/users-model.js')
const checkUserFree = (req, res, next) => {
    User.findBy({ username: req.newUser.username })
      .then((user) => {
        if (!user) {
          next();
        } else {
          next({ status: 404, message: "username taken" });
        }
      })
      .catch((err) => next(err));
  };

module.exports = {checkUserFree};