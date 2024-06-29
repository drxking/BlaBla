const express = require("express");
const { createController, uploadController, deleteController } = require("../controllers/post-controller");
const router = express.Router()

const upload = require("../config/multer-config");
const { isLoggedIn } = require("../middlewares/isLoggedin");



router.get("/create/:user",isLoggedIn, createController)


router.get("/delete/:postId",isLoggedIn ,deleteController)

router.post("/upload/:user", upload.single("picture"), uploadController)
module.exports = router;

