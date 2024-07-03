let express = require("express")
const { followController, unfollowController } = require("../controllers/connection-controller")
const { isLoggedIn } = require("../middlewares/isLoggedin")
let router = express.Router()

router.get("/follow/:liveUser/:user",isLoggedIn,followController)

router.get("/unfollow/:liveUser/:user",isLoggedIn,unfollowController)



module.exports = router