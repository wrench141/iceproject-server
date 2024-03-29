const { veryifyEmail, verifyCode, createPassword, validatePassword, forgetPassword, resetPassword } = require("../controllers/auth.js");

const authRouter = require("express").Router();

authRouter.post("/verifyemail", veryifyEmail);
authRouter.post("/verifycode", verifyCode);
authRouter.post("/register", createPassword);
authRouter.post("/login", validatePassword);
authRouter.post("/forgetpassword", forgetPassword);
authRouter.post("/resetpassword/:token", resetPassword);


module.exports = authRouter;