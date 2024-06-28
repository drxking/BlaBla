const { postModel } = require("../models/post-model")
const { userModel } = require("../models/user-model")

module.exports.feedController = async (req,res)=>{
    let user = await userModel.findOne({email:req.user})
    let post = await postModel.find().populate("userId")
    post.reverse()
    res.render("feed",{post,user})
}