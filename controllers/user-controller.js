const { validator, userModel } = require("../models/user-model");
const bcrypt = require("bcrypt")
const log = require("debug")("development:userController")
const jwt = require("jsonwebtoken")
const { postModel } = require("../models/post-model");
const { compress } = require("../utils/sharp");
require("dotenv").config()
const sharp = require("sharp");
const { UserName } = require("../utils/username");

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
                return res.redirect("/feed")
            }

        }
        let username = await UserName(name)

        let createdUser = await userModel.create({ name, username, email, password: hash })
        let token = jwt.sign({ email }, process.env.JWT_KEY)
        res.cookie("token", token)
        res.redirect("/feed")
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
        let token = jwt.sign({ email }, process.env.JWT_KEY)
        res.cookie("token", token)
        res.redirect('/feed');
    }
    catch (err) {
        res.send(err.message).status(500)
    }
}


module.exports.profileController = async (req, res) => {
    try {
        let token = req.cookies.token
        let email = jwt.verify(token, process.env.JWT_KEY).email
        let user = await userModel.findOne({ username: req.params.username })
        let liveUser = await userModel.findOne({ email: req.user })
        let me = false
        if (email === user.email) {
            me = true
        }
        let post = await postModel.find({ userId: user._id }).populate("userId")
        post.reverse()
        res.render('profile', { user, post, me, liveUser })
    }
    catch (err) {
        res.send(err.message).status(500)
    }
}


module.exports.notificationController = async (req, res) => {
    let user = await userModel.findOne({ username: req.params.username })
    user.notification.reverse()
    res.render("notification", { user })
}



module.exports.editController = async (req, res) => {
    try {
        let token = req.cookies.token
        let email = jwt.verify(token, process.env.JWT_KEY).email
        let liveUser = await userModel.findOne({ email: req.user })
        res.render("edit-profile", { liveUser })
    }
    catch (err) {
        res.send(err.message).status(500)
    }
}

module.exports.updateController = async (req, res) => {
    try {
        let { name, bio } = req.body;
        if (req.file) {
            let picMimeType = req.file.mimetype

            let profilePic = await compress(req.file.buffer, 480, 480)
            let createdPost = await postModel.create({ userId: req.params.userId, status: "updated the profile picture", picture: profilePic, })
            let user = await userModel.findOneAndUpdate({ _id: req.params.userId }, { name, bio, picMimeType, profilePic }, { new: true })
            await user.posts.push(createdPost._id)
            await user.save()
            res.redirect(`/user/profile/${user.username}`)
        }
        else {
            let user = await userModel.findOneAndUpdate({ _id: req.params.userId }, { name, bio }, { new: true })
            res.redirect(`/user/profile/${user.username}`)

        }

    }
    catch (err) {
        res.send(err.message).status(500)
    }
}

module.exports.logoutController = async (req, res) => {
    res.clearCookie('token');
    req.flash("message", "Logged Out")
    res.redirect("/user/login")
}





module.exports.searchController = async (req, res) => {
    let liveUser = await userModel.findOne({ email: req.user })
    res.render("search",{liveUser})
}

module.exports.searchUserController = async (req, res) => {
    let name = req.params.name
    let users = ""
    if (name[0] == "@") {
        users = await userModel.find({ username: { $regex: `^${name}`, $options: 'i' } });
    }
    else {
        users = await userModel.find({ name: { $regex: `^${name}`, $options: 'i' } });
    }
    return res.json(users)

}