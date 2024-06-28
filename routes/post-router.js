const express = require("express");
const { createController,uploadController } = require("../controllers/post-controller");
const router = express.Router()

const upload = require("../config/multer-config")



router.get("/create/:user",createController)



router.post("/upload/:user",upload.single("picture"),uploadController)
module.exports = router;

