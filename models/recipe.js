const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  ingredients: { type: Array, required: true },
  instructions: { type: String, required: true }, 
});


const recipeModel = mongoose.model("Recipes", recipeSchema);
module.exports = recipeModel;
