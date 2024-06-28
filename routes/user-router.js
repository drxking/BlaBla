const express = require("express")
const router = express.Router()
const { signupController, signupValidateController, loginController, loginValidateController, profileController } = require("../controllers/user-controller")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const { userModel } = require("../models/user-model")
const { isLoggedIn } = require("../middlewares/isLoggedin")
router.get("/signup", signupController)


router.post("/signupvalidate", signupValidateController)


router.get("/login", loginController)


router.post("/loginvalidate", loginValidateController)


router.get("/profile", isLoggedIn,profileController)



module.exports = router;