const codeModel = require("../models/codes");
const userModel = require("../models/user");
const sendCode = require("../utils/mailer");
const bcrypt = require("bcrypt");
const { generateToken, validateToken } = require("../utils/jwtToken");
const { validateHash, hashData } = require("../utils/hashing");

const veryifyEmail = async(req, res) => {
    try {
        const email = req.body.email;
        console.log(email)
        const code = Math.floor(Math.random() * 90000) + 10000;
        await codeModel.findOneAndDelete({email});
        let status = sendCode(email, code);
        new codeModel({ email, code }).save();
        if (status) {
          res
            .status(200)
            .json({
              msg: `An email with verification code has been sent to your email`,
            });
        }else{
            res.status(404).json({
              msg: "Invalid Email, please try again",
            });
        }
    } catch (error) {
        res.status(500).json({"msg": "Something went Wrong"})
    }
}

const verifyCode = async(req, res) => {
    try {
        const body = req.body;
        const codeObj = await codeModel.findOne({email: body.email});
        if(codeObj != null){
            const status = await validateHash(
              codeObj.code,
              body.code
            );
            if(!status){
                res.status(400).json({ msg: "Invalid Code" });
            }
            else{
                await codeModel.findByIdAndDelete(codeObj._id);
                const user = await userModel.findOne({email:body.email});
                if(user === null){
                    new userModel({ email: body.email }).save();
                    const token = generateToken(body.email);
                    res.status(200).json({ status: "register", msg: "Code verified", token: token });
                }else{
                    const token = generateToken(body.email);
                    res
                        .status(200)
                        .json({ status: "register", msg: "Code verified", token: token });
                    }
                }
            }else{
                res.status(404).json({ msg: "Code cannot be empty" });
            }
        } catch (error) {
        console.log(error)
        res.status(500).json({"msg": "Something went Wrong"})
    }
}

//register
const createPassword = async(req, res) => {
    try {
        const body = req.body;
        const user = await userModel.findOne({email: body.email});
        if(user != null && !user.verificationStatus){
            user.password = await hashData(body.password);
            user.verificationStatus = true;
            await user.save();
            const token = generateToken(body.email);
            res.status(200).json({"msg": "password updated.", "token": token})
        }else{
            res.status(400).json({"msg": "Already registered"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({"msg": "Something went Wrong"})
    }
}

//login 
const validatePassword = async(req, res) => {
    try {
        const body = req.body;
        const user = await userModel.findOne({email: body.email});
        if(user != null){
            const status = await validateHash(user.password, body.password);
            if (status && user.verificationStatus) {
              const token = generateToken(body.email);
              res.status(200).json({ msg: "user logged in", "token": token });
            }else{
                res.status(400).json({ msg: "Invalid Credintials" });
            }
        }else{
            res.status(400).json({ msg: "User not found" });
        }
    } catch (error) {
        res.status(500).json({"msg": "Something went Wrong"})
    }
}

const forgetPassword = async(req, res) => {
    try {
        const email = req.body.email;
        const user = await userModel.findOne({email});
        if(user != null){
            const token = generateToken(user.email)
            const reset_uri = `http://${process.env.FRONTENDURI}/resetpassword/${token}`;
            const status = sendCode(email, reset_uri);
            if(status){
                user.resetToken = token;
                user.resetTokenExpiresAt = new Date(
                  Date.now() + 10 * 60 * 1000
                );
                await user.save()
                res.status(200).json({"msg": "Reset link has been sent to your mail."})
            }else{
                res.status(404).json({ msg: "Invalid Email" });
            }
        }else{
            res.status(404).json({"msg": "User not found"})
        }
    } catch (error) {
        res.status(500).json({"msg": "Something went Wrong"})
    }
}

const resetPassword = async(req, res) => {
    try {
        const token = req.params.token;
        const password = req.body.password;
        const email = validateToken(token);
        const user = await userModel.findOne({email});
        if(user){
            const current_date = new Date();
            let stored_data = validateToken(user.resetToken);
            if(user.resetTokenExpiresAt > current_date && email == stored_data){
                user.resetToken = null;
                user.resetTokenExpiresAt = null;
                user.password = await hashData(password);
                await user.save();
                res.status(200).json({"msg": "Password reset successfull"})
            }else{
                res.status(404).json({ msg: "Reset link has been expired, try again" });
            }
        }else{
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({"msg": "Something went Wrong"})
    }
}

module.exports = {
  veryifyEmail,
  verifyCode, 
  createPassword, 
  validatePassword,
  forgetPassword,
  resetPassword
};

