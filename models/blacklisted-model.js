const mongoose = require("mongoose")

const blacklistedSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24
    },
    email: {
        type: String,
        required: true
    }
});



module.exports.blacklistedModel = mongoose.model("blacklisted", blacklistedSchema)