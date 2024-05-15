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
const contactRouter = require("./routes/contact");
const shopRouter = require("./routes/shop");
const { validateToken } = require("./utils/jwtToken");
const userModel = require("./models/user");

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
app.use("/contact", contactRouter);
app.use("/shops", shopRouter);

app.get("/isAdmin", async(req, res, next) => {
    try{
        const email = validateToken(req.headers.token);
        if(email != null){
            const user = await userModel.findOne({email});
            if(user != null){
                if(user.isAdmin == true){
                  res.status(200).json({"msg" : true})
                }else{
                  res.status(403).json({"msg" : false})
                }
            }else{
                res.status(404).json({"msg": false})
            }
        }else{
            res.status(404).json({"msg": false})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({"msg": false})
    }
  }
)

mongoose.connect(process.env.DB).then(() => {
    app.listen(PORT, () => {
      console.log(`server listening - ${PORT}`);
    });
})