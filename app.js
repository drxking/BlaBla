const express = require("express")
const log = require("debug")("development:mainapp")
const path = require("path")
const connectFlash = require("connect-flash")
const expressSession = require("express-session")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const passport = require("passport")

require("dotenv").config()
require('./config/google-strategy');
const databaseConnection = require("./config/mongoose-connection")
const userRouter = require("./routes/user-router");
const authRouter = require('./routes/auth-router')
const postRouter = require("./routes/post-router")
const feedRouter = require("./routes/feed-router")
const { validator, userModel } = require("./models/user-model")


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.set("view engine", "ejs")
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(connectFlash())

app.get("/", async (req, res) => {
    try {
        let token = req.cookies.token
        if (token) {
            let data = jwt.verify(token, process.env.JWT_KEY).email
            if (data) {
                return res.redirect("/feed")
            }
        }
        console.log(token)
        res.redirect("/user/login")
    }
    catch (err) {
        res.send(`Haha! Token Misplaced!!! Nice try: ${err.message}`).status(500)
    }
})

app.use("/user", userRouter)

app.use("/auth", authRouter)

app.use("/post", postRouter)

app.use("/feed", feedRouter)

app.listen(process.env.PORT, () => {
    log(`Listening at port ${process.env.PORT}`)
})