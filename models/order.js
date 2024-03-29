const mongoose = require("mongoose");

var orderSchema = mongoose.Schema({
  userid: { type: String, required: true },
  prodid: { type: String, required: true },
  price: { type: Number, required: true },
  phone: { type: Number, required: true },
  trackingid: { type: String },
  quantity: { type: Number, required: true },
  pickupLoc: { type: String, required: true },
  deliveryCharges: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  expDate: { type: Date, required: true },
});

const orderModel = mongoose.model("Orders", orderSchema);
module.exports = orderModel;
