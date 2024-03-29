const recipeModel = require("../models/recipe.js");
const remDups = require("../utils/remDups.js");


const getRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel.find();

    if (req.body.ingredients != null) {
      const userIngredients = req.body.ingredients.map((ingredient) =>
        ingredient.toLowerCase()
      );

      if (userIngredients != null) {
        const shelfed = recipes.map((recipe) => {
          const missingIngredients = recipe.ingredients.filter(
            (ingredient) =>
              !userIngredients.some((userIngredient) =>
                ingredient.includes(userIngredient)
              )
          );

          return {
            ...recipe._doc,
            missingIngredients,
          };
        });

        res.status(200).json({ msg: shelfed });
      } else {
        res.status(200).json({ msg: recipes });
      }
    } else {
      res.status(200).json({ msg: recipes });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel.find();
    res.status(200).json({ msg: recipes });
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "server error" });
  }
};



const getShelfItems = async(req, res) => {
    try {
        const recipes = await recipeModel.find();
        const ingredients = remDups(
          recipes
            .map((recipe) => {
              return recipe.ingredients.map((ingredient) => {return ingredient.toLowerCase()});
            })
            .flat()
        );
        res.status(200).json({"ingredients": ingredients})
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const createRecipe = async(req, res) => { 
    const body = req.body;
    try {
        const ingredients = body.ingredients.map(ingredient => {return ingredient.toLowerCase()})
        const newRecipe = new recipeModel({
          name: body.name,
          type: body.type,
          ingredients: ingredients,
          instructions: body.instructions,
        });
        await newRecipe.save();
        res.status(200).json({"msg": "new recipe created."})
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const updateRecipe = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    try {
        const recipe = await recipeModel.findById(id);
        if(recipe != null){
            recipe.name = body.name, 
            recipe.type = body.type, 
            recipe.ingredients = body.ingredients,
            recipe.instructions = body.instructions
            await recipe.save();
            res.status(200).json({"msg": "recipe updated"})
        }else{
            res.status(404).json({ msg: "recipe not found" });
        }
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const deleteRecipe = async(req, res) => {
  const body = req.body;
  const id = req.params.id;
  try {
    await recipeModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "recipe removed" });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
}


module.exports = {
  getRecipes,
  createRecipe,
  updateRecipe,
  getShelfItems,
  getAllRecipes,
  deleteRecipe,
};