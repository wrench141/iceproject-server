const {
  getBrand,
  getBrands,
  saveShopInfo,
  deleteShopInfo,
  updateShopInfo,
} = require("../controllers/shop.js");

const shopRouter = require("express").Router();

shopRouter.get("/getBrand", getBrand);
shopRouter.get("/getBrands", getBrands);
shopRouter.post("/saveShopInfo", saveShopInfo);
shopRouter.patch("/updateShopInfo/:id", updateShopInfo);
shopRouter.delete("/deleteShopInfo/:id", deleteShopInfo);

module.exports = shopRouter;
