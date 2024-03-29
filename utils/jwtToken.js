const jwt = require("jsonwebtoken");


function generateToken (email){
    const token = jwt.sign(email, process.env.JWT_SALT);
    return token;
}


function validateToken(token){
    const email = jwt.decode(token, process.env.JWT_SALT)
    return email;
}

module.exports = {generateToken, validateToken}