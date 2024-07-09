const { blacklistedModel } = require("../models/blacklisted-model")
const { userModel } = require("../models/user-model")
const jwt = require("jsonwebtoken")

module.exports.followController = async (req, res) => {
    try {
        let liveUser = await userModel.findOne({ _id: req.params.liveUser })
        if (req.user == liveUser.email) {
            let user = await userModel.findOne({ _id: req.params.user })
            if (liveUser.following.includes(user._id)) {
                await blacklistedModel.create({ email: req.user })
                return res.send("You have Performed Unauthorized Activity And Been Blacklisted").status(401)
            }
            await liveUser.following.push(req.params.user)
            await liveUser.save()
            await user.followers.push(req.params.liveUser)
            await user.notification.push(`${liveUser.name} started following you`)
            await user.save()
            res.redirect(`/user/profile/${user.username}`);
        }
        else {
            await blacklistedModel.create({ email: req.user })
            res.send("You have Performed Authorized Activity And Been Blacklisted").status(401)
        }
    }
    catch (err) {
        res.send(err.message).status(500)
    }
}

module.exports.unfollowController = async (req, res) => {
    try {
        let liveUser = await userModel.findOne({ _id: req.params.liveUser })
        if (req.user == liveUser.email) {
            let user = await userModel.findOne({ _id: req.params.user })
            await liveUser.following.pop(req.params.user)
            await liveUser.save()
            await user.followers.pop(req.params.liveUser)
            await user.save()
            res.redirect(`/user/profile/${user.username}`);
        }
        else {
            let token = req.cookies.token
            let email = jwt.verify(token, process.env.JWT_KEY).email
            await blacklistedModel.create({ email })
            res.send("You have Performed Authorized Activity And Been Blacklisted").status(401)
        }
    }
    catch (err) {
        res.send(err.message).status(500)
    }
}



module.exports.followersController = async (req, res) => {
    let user = await userModel.findOne({ username: req.params.user }).populate("followers")
    res.render('followers', { user });
}

module.exports.followingController = async (req, res) => {
    let user = await userModel.findOne({ username: req.params.user }).populate("following")
    res.render('following', { user });
}