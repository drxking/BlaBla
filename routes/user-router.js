const express = require("express")
const router = express.Router()
const { signupController, signupValidateController, loginController, loginValidateController, profileController, editController, updateController, logoutController } = require("../controllers/user-controller")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const { userModel } = require("../models/user-model")
const { isLoggedIn } = require("../middlewares/isLoggedin")
const upload = require("../config/multer-config")


router.get("/signup", signupController)


router.post("/signupvalidate", signupValidateController)


router.get("/login", loginController)


router.post("/loginvalidate", loginValidateController)


router.get("/profile/:username", isLoggedIn, profileController)

router.get("/edit", isLoggedIn, editController)

router.post("/update/:userId", upload.single("profilePic"), updateController)

router.get("/logout", logoutController)

module.exports = router;