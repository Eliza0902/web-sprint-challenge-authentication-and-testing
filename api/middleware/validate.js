
const User = require('../auth/users-model')
 const validate= (req, res, next)=> {
     const {username} = req.body
    User.findBy({username : username.trim()})
    .then((user) =>{
        if (user){req.user = user; next()} else {res.status(404).json({message : 'invalid credentials'})}
    })
    .catch((err) =>{
        next(err)
    })
}
module.exports = {validate}