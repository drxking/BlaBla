const sharp = require("sharp");

async function compress(input,size) {
    return await sharp(input).resize(size).rotate().toBuffer()

}

module.exports.compress = compress;