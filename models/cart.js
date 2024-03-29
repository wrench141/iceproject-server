const mongoose = require("mongoose");

var cartSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  prodid: { type: String, required: true },
  quantity: {type: Number, required: true}
});

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;
