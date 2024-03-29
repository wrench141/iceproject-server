const bcrypt = require("bcrypt");


async function hashData(data){
    const hash = await bcrypt.hash(data, 10);
    return hash
}


async function validateHash(hash, data){
    const status = await bcrypt.compare(data, hash);
    return status
}

module.exports = {hashData, validateHash}