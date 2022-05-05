const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../auth/index.js');


module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        next({ status: 404, message: "token invalid" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    next({ status: 404, message: "token required" });
  }
}
