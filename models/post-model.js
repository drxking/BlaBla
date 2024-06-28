const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    description: {
        type: String,
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    picture: {
        type: Buffer,
        default: ""
    },
    mimetype:{
        type:String,
        default:"image/png"
    }
});



module.exports.postModel = mongoose.model("post", postSchema)
