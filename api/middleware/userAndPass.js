const userAndPass = (req, res, next) => {
    const {username, password} = req.body;
    if(!username ||username.trim() === "" || typeof username !== "string" || !password|| typeof password !== "string" || password.trim() === ""){
        next({status: 404, message: 'username and password required'})
    } else {req.newUser = {username: username.trim(), password : password.trim()};
    next();
}};

module.exports = {userAndPass};