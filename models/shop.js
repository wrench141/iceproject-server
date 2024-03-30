const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
});

const shopModel = mongoose.model("Shops", shopSchema);
module.exports = shopModel;
