const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./routes/auth");
const authMiddleware = require("./middlewares/authMiddleware");
require("dotenv").config();
const cloudinary = require("cloudinary");
const learnRouter = require("./routes/learn");
const cartRouter = require("./routes/cart");
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");

const app = express();
const PORT = process.env.PORT || 4000
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
app.use("/cart", cartRouter)
app.use("/products", productRouter);
app.use("/orders", orderRouter);

mongoose.connect(process.env.DB).then(() => {
    app.listen(PORT, () => {
      console.log(`server listening - ${PORT}`);
    });
})