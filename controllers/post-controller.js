const { postModel } = require("../models/post-model")
const { userModel } = require("../models/user-model")
const path = require("path")
const { compress } = require("../utils/sharp")
module.exports.createController = async (req, res) => {
    let user = await userModel.findOne({ email: req.params.user })
    let liveUser = await userModel.findOne({ email: req.user })
    res.render("create-post", { user, liveUser })
}

module.exports.uploadController = async (req, res) => {
    try {
        let email = req.params.user
        let description = req.body.description;
        let user = await userModel.findOne({ email })
        if (req.file) {
            let compressed = await compress(req.file.buffer, 720)
            let post = await postModel.create({
                userId: user.id,
                description,
                picture: compressed,
                mimetype: req.file.mimetype
            })
            await user.posts.push(post._id)
            await user.save()
            res.redirect(`/user/profile/${user.username}`);
        }
        else {
            let post = await postModel.create({
                userId: user.id,
                description
            })
            await user.posts.push(post._id)
            await user.save()
            res.redirect(`/user/profile/${user.username}`);
        }

    }
    catch (err) {
        res.send(err.message)
    }
}


module.exports.deleteController = async (req, res) => {
    let post = await postModel.findOneAndDelete({ _id: req.params.postId })
    let user = await userModel.findOne({ _id: post.userId })
    await user.posts.pop(post._id)
    await user.save()
    res.redirect(`/user/profile/${user.username}`)
}