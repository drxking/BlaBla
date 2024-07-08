const sharp = require("sharp");

async function compress(input,height,width) {
   if(width){
    return await sharp(input).resize(height,width).rotate().toBuffer()
   }
   return await sharp(input).resize(height).rotate().toBuffer()
}

module.exports.compress = compress;

