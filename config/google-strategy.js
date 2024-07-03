const passport = require('passport');
const log = require('debug')("development:Google-Strategy")
const GoogleStrategy = require('passport-google-oauth20');


const { userModel } = require('../models/user-model');
const { UserName } = require('../utils/username');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        cb(null, profile)
        try {
            let userId = profile.id
            let userName = profile.displayName
            let userEmail = profile._json.email
            let user = await userModel.findOne({ email: userEmail })
            if (user) {
                let oauthField = user.oauthId;
                if (!oauthField) {
                    await userModel.findOneAndUpdate({ email: user.email }, { oauthId: userId })
                }
            }
            else {
                let username = UserName(userName)
                await userModel.create({
                    name: userName,
                    email: userEmail,
                    oauthId: userId,
                    username: username
                })
            }
        }
        catch (err) {
            log(err)
        }
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user)
})
passport.deserializeUser((user, cb) => {
    cb(null, user)
})