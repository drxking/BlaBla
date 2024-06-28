const express = require("express");
const passport = require("passport");
const router = express.Router()
const log = require("debug")("development:Auth-Router")
const jwt = require("jsonwebtoken")
require("dotenv").config()

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get('/callback',
    passport.authenticate('google', { failureRedirect: '/user/login' }),
    function (req, res) {
        try {
            let token = jwt.sign({ email: req.user._json.email}, process.env.JWT_KEY)
            res.cookie("token", token)
            res.redirect('/user/profile');
        }
        catch (err) {
            res.status(500).send(err.message)
        }
    });

module.exports = router;
