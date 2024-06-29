const sharp = require("sharp");

async function compress(input) {
    return await sharp(input).resize(720).toBuffer()

}

module.exports.compress = compress;