const { postModel } = require("../models/post-model")
const { userModel } = require("../models/user-model")
const path = require("path")
const { compress } = require("../utils/sharp")
module.exports.createController = async (req, res) => {
    let user = await userModel.findOne({ email: req.params.user })
    console.log
    res.render("create-post", { user })
}

module.exports.uploadController = async (req, res) => {
    try {
        let email = req.params.user
        let description = req.body.description;
        let user = await userModel.findOne({ email })
        let compressed = await compress(req.file.buffer)
        let post = await postModel.create({
            userId: user.id,
            description,
            picture: compressed,
            mimetype: req.file.mimetype
        })
        await user.posts.push(post._id)
        await user.save()
        res.redirect('/user/profile');
    }
    catch (err) {
        res.send(err.message)
    }
}
