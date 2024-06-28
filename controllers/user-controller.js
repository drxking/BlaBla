const { validator, userModel } = require("../models/user-model");
const bcrypt = require("bcrypt")
const log = require("debug")("development:userController")
const jwt = require("jsonwebtoken")
const {postModel} = require("../models/post-model")
require("dotenv").config()

module.exports.signupController = (req, res) => {
    try {
        let flashMessage = req.flash("message")
        res.render('signup', { flashMessage });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports.signupValidateController = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        let joiResult = validator({ name, email })
        if (joiResult) return req.flash("message", joiResult.message), res.redirect('/user/signup');
        let findUser = await userModel.findOne({ email });
        let salt = await bcrypt.genSalt()
        let hash = await bcrypt.hash(password, salt)
        if (findUser) {
            if (findUser.password) return req.flash("message", "This email already exists! Please Try to login"), res.redirect('/user/signup');
            let oauthField = findUser.oauthId
            if (oauthField) {
                await userModel.findOneAndUpdate({ oauthId: oauthField }, { password: hash })
                let token = jwt.sign({ email }, process.env.JWT_KEY)
                res.cookie("token", token)
                req.flash("message", "Signedup successfully!")
                return res.redirect("/user/profile")
            }

        }

        let createdUser = await userModel.create({ name, email, password: hash })
        let token = jwt.sign({ email }, process.env.JWT_KEY)
        res.cookie("token", token)
        req.flash("message", "Signedup successfully!")
        res.redirect("/user/profile")
    }
    catch (err) {
        res.send(err.message).status(500)
    }
}

module.exports.loginController = (req, res) => {
    try {
        let flashMessage = req.flash("message")
        res.render("login", { flashMessage })
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}



module.exports.loginValidateController = async (req, res) => {
    try {
        let { email, password } = req.body;
        let findUser = await userModel.findOne({ email })
        if (!findUser) return req.flash("message", "Account with this email doesnot exists!"), res.redirect("/user/login");
        let hashCheck = await bcrypt.compare(password, findUser.password);
        if (!hashCheck) return req.flash("message", "Email or Password Doesnot match!"), res.redirect("/user/login")
        req.flash("message", "Logged in Successfully")
        let token = jwt.sign({ email }, process.env.JWT_KEY)
        res.cookie("token", token)
        res.redirect('/user/profile');
    }
    catch (err) {
        res.send(err.message).status(500)
    }
}


module.exports.profileController = async (req, res) => {
    try {
        let token = req.cookies.token
        let email = jwt.verify(token, process.env.JWT_KEY).email
        let user = await userModel.findOne({ email })
        let id = user._id
        let post = await postModel.find({userId:id}).populate("userId")
        // console.log(post)
        user.bio = `Digital storyteller `
        res.render('profile', { user,post })
    }
    catch (err) {
        res.send(err.message).status(500)
    }
}