const express = require("express");
const { feedController } = require("../controllers/feed-controller");
const { isLoggedIn } = require("../middlewares/isLoggedin");
const router = express.Router()


router.get("/",isLoggedIn,feedController)


module.exports = router;