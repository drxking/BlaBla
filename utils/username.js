let { userModel } = require("../models/user-model")
let username = async (name) => {
    let numbers = Math.random() * 10000000
    numbers = Math.floor(numbers)
    let string = name.split("")
    string = string.map(item => {
        if (item == " ") {
            return "_"
        }
        else {
            return item
        }
    })
    string = string.join("").toLowerCase()
    let userName = `@${string}${numbers}`
    let user = await userModel.findOne({ username: userName })
    if (user){
        await username(name)
    }
    else {
        return userName
    }
}

module.exports.UserName = username

