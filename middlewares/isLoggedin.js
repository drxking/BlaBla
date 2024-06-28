const jwt = require("jsonwebtoken")
module.exports.isLoggedIn = (req, res, next) => {
    let token = req.cookies.token
    if (token) {
        let data = jwt.verify(token, process.env.JWT_KEY).email
        req.user = data
        if (data) return next()
    }
req.flash("message","You must be Logged in")
    res.redirect('/user/login');
}