const joi = require("joi")
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default:""
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    theme: {
        type: String,
        default: 'light'
    },
    profilePic: {
        type: Buffer,
        default: ''
    },
    oauthId:{
        type:String,
        default:''
    },
    oauthProfilePic:{
        type:String,
        default:"/images/profile-pic.png"
    },
    bio:{
        type:String,
        default:""
    }
});

function validator(data) {
    const Schema = joi.object({
        name: joi.string().required().min(3),
        email: joi.string().email().required(),
    })
    return Schema.validate(data).error
}

module.exports.userModel = mongoose.model("user", userSchema)
module.exports.validator = validator;