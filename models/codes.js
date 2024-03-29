const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const codesSchema = mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, expires: 300 },
});

codesSchema.pre("save", function(next) {
  if (!this.isModified("code")) {
    return next();
  }
  bcrypt.hash(this.code, 12, (err, hash) => {
    if (err) {
      return next();
    } else {
      this.code = hash;
      next();
    }
  });
});

const codeModel = mongoose.model("Codes", codesSchema);
module.exports = codeModel;
