const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/products.js");
const { authMiddleware, adminMiddleWare } = require("../middlewares/authMiddleware.js");

const productRouter = require("express").Router();

productRouter.get("/getProduct/:id", getProduct);

productRouter.get("/getProducts", getProducts);

productRouter.post(
  "/createProduct",
  authMiddleware,
  adminMiddleWare,
  createProduct
);

productRouter.patch(
  "/uploadProductImage/:id",
  authMiddleware,
  adminMiddleWare,
  uploadImage
);

productRouter.patch(
  "/updateProduct/:prodId",
  authMiddleware,
  adminMiddleWare,
  updateProduct
);

productRouter.delete(
  "/deleteProduct/:prodId",
  authMiddleware,
  adminMiddleWare,
  deleteProduct
);

module.exports = productRouter;
