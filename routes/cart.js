const {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  checkOut,
} = require("../controllers/cart.js");
const {
  authMiddleware,
  adminMiddleWare,
} = require("../middlewares/authMiddleware.js");


const cartRouter = require("express").Router();

cartRouter.get("/getCartItems", authMiddleware, getCart);
cartRouter.get("/checkout", authMiddleware, checkOut);
cartRouter.post("/addToCart/:prodId", authMiddleware, addToCart);
cartRouter.patch("/updateCartItem/:itemID", authMiddleware, updateCart);
cartRouter.delete("/deleteCartItem/:itemID", authMiddleware, deleteCart);

module.exports = cartRouter;
