let express = require("express")
const { followController, unfollowController, followersController, followingController } = require("../controllers/connection-controller")
const { isLoggedIn } = require("../middlewares/isLoggedin")
let router = express.Router()

router.get("/follow/:liveUser/:user", isLoggedIn, followController)

router.get("/unfollow/:liveUser/:user", isLoggedIn, unfollowController)

router.get("/followers/:user", isLoggedIn, followersController)

router.get("/following/:user", isLoggedIn, followingController)

module.exports = router