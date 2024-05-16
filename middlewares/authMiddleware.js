const userModel = require("../models/user");
const {validateToken} = require("../utils/jwtToken")

const authMiddleware = async(req, res, next) => {
    try {
        const email = validateToken(req.headers.token); 
        console.log(email)
        if(email != null){
            const user = await userModel.findOne({email});
            if(user != null){
                req.body.email = email;
                req.body.id = user._id
                next();
            }else{
                res.status(404).json({"msg": "invalid token1"})
            }
        }else{
            res.status(404).json({"msg": "invalid token2"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({"msg": "server error"})
    }
}

const adminMiddleWare = async(req, res, next) => {
    try{
        const email = validateToken(req.headers.token);
        if(email != null){
            const user = await userModel.findOne({email});
            if(user != null){
                if(user.isAdmin == true){
                    req.body.email = email;
                    req.body.id = user._id;
                    next();
                }else{
                    res.status(403).json({"msg" : "Not an admin user"})
                }
            }else{
                res.status(404).json({"msg": "invalid token3"})
            }
        }else{
            res.status(404).json({"msg": "invalid token4"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({"msg": "server error"})
    }
}

module.exports = { authMiddleware, adminMiddleWare };