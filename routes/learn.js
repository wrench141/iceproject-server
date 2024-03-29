const {
  getRecipes,
  createRecipe,
  updateRecipe,
  getShelfItems,
  getAllRecipes,
  deleteRecipe,
} = require("../controllers/learn.js");
const { authMiddleware, adminMiddleWare } = require("../middlewares/authMiddleware.js");

const learnRouter = require("express").Router();

learnRouter.post("/getRecipes", getRecipes);
learnRouter.get("/getAllRecipes", getAllRecipes);
learnRouter.get("/getShelfItems", getShelfItems);
learnRouter.post("/createRecipe", authMiddleware, adminMiddleWare, createRecipe);
learnRouter.patch("/updateRecipe/:id", authMiddleware, adminMiddleWare, updateRecipe);
learnRouter.delete(
  "/removeRecipe/:id",
  authMiddleware,
  adminMiddleWare,
  deleteRecipe
);


module.exports = learnRouter;
