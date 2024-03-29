
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const validator = require("validator")

var userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
    },
  },
  password: {
    type: String,
    validate: {
      validator: (value) => {
        return value.length >= 8;
      },
      message: "Password should be at least 8 characters long",
    },
  },
  verificationStatus: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiresAt: {
    type: Date,
    default: null,
  },
  otp: {
    type: String,
    default: null,
  },
  resetOtpExpiresAt: {
    type: Date,
    default: null,
  },
  isAdmin:{
    type: Boolean,
    default: false
  }
});


userSchema.methods.genToken = () => {
  const token = jwt.sign(this.email, process.env.SALT);
  return token;
};

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel