const {
  getOrders,
  getOrderDetails,
  createOrder,
  updateOrder,
  removeOrder,
  cancelOrder,
  getAllOrders,
  getOrderData,
} = require("../controllers/order.js");
const {
  authMiddleware,
  adminMiddleWare,
} = require("../middlewares/authMiddleware.js");

const orderRouter = require("express").Router();

orderRouter.get("/getOrderDetails/:orderid", authMiddleware, getOrderDetails);

orderRouter.get("/getOrders", authMiddleware, getOrders);

orderRouter.get("/getAllOrders", authMiddleware, adminMiddleWare, getAllOrders);

orderRouter.get("/getOrderData", authMiddleware, getOrderData);

orderRouter.post("/createOrder/:prodid", authMiddleware, createOrder);

orderRouter.patch(
  "/updateOrder/:id",
  authMiddleware,
  adminMiddleWare,
  updateOrder
);

orderRouter.delete(
  "/removeOrder/:prodId",
  authMiddleware,
  adminMiddleWare,
  removeOrder
);

orderRouter.delete(
  "/cancelOrder/:prodId",
  authMiddleware,
  cancelOrder
);

module.exports = orderRouter;
