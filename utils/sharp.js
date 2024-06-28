const sharp = require("sharp");

async function compress(input) {
    return await sharp(input).resize(1080).toBuffer()

}

module.exports.compress = compress;