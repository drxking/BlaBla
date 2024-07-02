
let username = (name)=>{
    let numbers = Math.random() *10000000
    numbers = Math.floor(numbers)
    let string = name.split("")
    string = string.map(item => {
        if(item == " "){
            return "_"
        }
        else{
            return item
        }
    })
    string = string.join("").toLowerCase()
    return `@${string}${numbers}`
}

module.exports.UserName  = username

