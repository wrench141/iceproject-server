const cartModel = require("../models/cart");
const prodModel = require("../models/product");


const getCart = async (req, res) => {
  try {
    const id = req.body.id;
    const cartInfo = await cartModel.find({ userid: id });

    const data = await Promise.all(
      cartInfo.map(async (item) => {
        const prod = await prodModel.findById(item.prodid);
        return {
          product: prod,
          quantity: item.quantity,
          cartId: item._id
        };
      })
    );
    res.status(200).json({ msg: data });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const addToCart = async(req, res) => {
    try {
        const body = req.body;
        const prodid = req.params.prodId;
        const cartItem = await cartModel.findOne({prodid});
        if(!cartItem){
            const newCartItem = new cartModel({
              userid: body.id,
              prodid: prodid,
              quantity: body.quantity,
            });
            await newCartItem.save();
        }else{
            cartItem.quantity =
              parseInt(cartItem.quantity) + parseInt(body.quantity);
            await cartItem.save();
        }
        res.status(201).json({"msg": "Added to cart"})
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}
const updateCart = async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}
const deleteCart = async(req, res) => {
    try {
        const id = req.params.itemID;
        await cartModel.findByIdAndDelete(id);
        res.status(200).json({"msg": "Item removed"})
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const checkOut = async(req, res) => {
    try {
        const userid = req.body.id
        const cartItems = await cartModel.find({userid});
        console.log(cartItems)
    } catch (error) {
      res.status(500).json({ msg: "server error" });
    }
}


module.exports = { getCart, addToCart, updateCart, deleteCart, checkOut };