const { postModel } = require("../models/post-model")
const { userModel } = require("../models/user-model")
const { shuffleArray } = require("../utils/shuffle")

module.exports.feedController = async (req,res)=>{
    let user = await userModel.findOne({email:req.user})
    let post = await postModel.find().populate("userId")
    post = shuffleArray(post)
    res.render("feed",{post,user})
}

