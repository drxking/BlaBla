const jwt = require("jsonwebtoken")
const { blacklistedModel } = require("../models/blacklisted-model")
module.exports.isLoggedIn = async (req, res, next) => {
    try {
        let token = req.cookies.token
        if (token) {
            let checkBlackList = await blacklistedModel.find()
            let data = jwt.verify(token, process.env.JWT_KEY).email
            req.user = data
            for (i in checkBlackList) {
                if (checkBlackList[i].email == req.user) {
                    // res.clearCookie('token');
                    return res.render("blacklisted")
                }
            }
            if (data) return next()

        }
        req.flash("message", "You must be Logged in")
        res.redirect('/user/login');
    }
    catch (err) {
        res.send(`Token Misplaced ${err.message}`).status(500)
    }
}