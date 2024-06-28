const mongoose = require("mongoose")
const log = require("debug")("development:mongoose-connection")
require("dotenv").config
mongoose.connect(process.env.MONGODB_URI)

let db = mongoose.connection;
db.on("error",(err)=>{
    log(err.message)
})
db.on("open",()=>{
    log("Connected to Database Successfully")
})
module.exports = db;