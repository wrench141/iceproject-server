const mongoose = require("mongoose");

var contactSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  desc: { type: String, required: true },
  phone: { type: Number, required: true },
});

const contactModel = mongoose.model("Contacts", contactSchema);
module.exports = contactModel;
