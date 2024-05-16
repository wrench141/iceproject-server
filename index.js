const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const {
  authMiddleware,
  adminMiddleWare,
} = require("./middlewares/authMiddleware");
require("dotenv").config();
const cloudinary = require("cloudinary");
const learnRouter = require("./routes/learn");
const cartRouter = require("./routes/cart");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const contactRouter = require("./routes/contact");
const shopRouter = require("./routes/shop");
const { validateToken } = require("./utils/jwtToken");
const userModel = require("./models/user");
const orderModel = require("./models/order");

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

//routes
app.use("/auth", authRouter);
app.use("/recipes", learnRouter);
app.use("/cart", cartRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/contact", contactRouter);
app.use("/shops", shopRouter);

app.get("/isAdmin", async (req, res, next) => {
  try {
    const email = validateToken(req.headers.token);
    if (email != null) {
      const user = await userModel.findOne({ email });
      if (user != null) {
        if (user.isAdmin == true) {
          res.status(200).json({ msg: true });
        } else {
          res.status(403).json({ msg: false });
        }
      } else {
        res.status(404).json({ msg: false });
      }
    } else {
      res.status(404).json({ msg: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: false });
  }
});

app.get("/analytics", authMiddleware, adminMiddleWare, async (req, res) => {
  try{

    const orders = await orderModel.find();

    const totalOrders = orders.length;
    const totalSales = orders.reduce(
      (total, order) => total + order.price,
      0
    );

    // Total Orders Cancelled
    const totalOrdersCancelled = orders.filter(
      (order) => order.status === "cancelled" || order.status === "rejected"
    ).length;

    // Total Delivered Orders
    const totalDeliveredOrders = orders.filter(
      (order) => order.status === "delivered"
    ).length;

    // Monthly Percentage
    const monthlyPercentage = [];
    const ordersPerMonth = Array.from({ length: 12 }, () => 0);
    orders.forEach((order) => {
      const month = order.date.getMonth();
      ordersPerMonth[month]++;
    });
    const totalOrdersPerYear = ordersPerMonth.reduce(
      (total, count) => total + count,
      0
    );
    ordersPerMonth.forEach((count, index) => {
      const month = new Date(2000, index).toLocaleString("en-us", {
        month: "short",
      });
      const percentage = ((count / totalOrdersPerYear) * 100).toFixed(2);
      monthlyPercentage.push({ month, percentage, count });
    });

    const averageSaleCountPerMonth = totalSales / 12;

    const monthlyAnalytics = [];
    let previousMonthSales = 0;
    for (let i = 0; i < 12; i++) {
      const year = new Date();
      console.log(year.toString().split(" ")[3]);
      const monthYear = new Date(year.toString().split(" ")[3], i)
        .toISOString()
        .slice(0, 7);
      console.log(monthYear)
      const ordersInMonth = orders.filter(
        (order) => order.date.toISOString().slice(0, 7) === monthYear
      );
      console.log(ordersInMonth)
      const totalSalesInMonth = ordersInMonth.reduce(
        (total, order) => {
          console.log(order.price)
          return total + order.price;
        },
        0
      );
      const comparison =
        previousMonthSales === 0
          ? (
              (totalSalesInMonth / totalSalesInMonth) * 100
            ).toFixed(2)
          : (
              ((totalSalesInMonth - previousMonthSales) / previousMonthSales) * 100
            ).toFixed(2);
      const month = new Date(monthYear).toLocaleString("en-us", {
        month: "short",
      });
      monthlyAnalytics.push({
        month,
        totalSales: totalSalesInMonth,
        comparison,
      });
      previousMonthSales = totalSalesInMonth;
    }

    res.json({
      monthlyPercentage,
      totalOrders,
      totalSales,
      averageSaleCountPerMonth,
      totalOrdersCancelled,
      totalDeliveredOrders,
      monthlyAnalytics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

mongoose.connect(process.env.DB).then(() => {
  app.listen(PORT, () => {
    console.log(`server listening - ${PORT}`);
  });
});
