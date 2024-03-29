const mongoose = require("mongoose");

var prodSchema = mongoose.Schema({
  prodimages: { type: Array },
  prodname: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  keywords: { type: String, required: true },
  price: { type: Number, reqiured: true },
  stock: { type: Number, required: true },
  discount: { type: Number, required:true },
});

const prodModel = mongoose.model("Products", prodSchema);
module.exports = prodModel;
