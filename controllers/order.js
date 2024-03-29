const orderModel = require("../models/order.js");
const prodModel = require("../models/product.js");


function getExpDate(date) {
  const currentDate = new Date(date);
  currentDate.setMonth(currentDate.getMonth() + 1);
  return currentDate.toISOString().slice(0, 10);
}

const getOrders = async (req, res) => {
  try {
    const userid = req.body.id;
    const orders = await orderModel.find({ userid });

    if (!orders) {
      res.status(404).json({ msg: "No Order Found" });
    } else {
      const data = await Promise.all(
        orders.map(async (order) => {
          const prod = await prodModel.findById(order.prodid);
          const orderDetails = {
            order,
            product: prod,
          };
          return orderDetails;
        })
      );

      res.status(200).json({ msg: data });
    }
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const getAllOrders = async(req, res) => {
    try {
        const orders = await orderModel.find();
        if(!orders){
            res.status(404).json({msg: "No Order Found"});
        }else{
            res.status(200).json({"msg": orders})
        }
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const getOrderDetails = async(req, res) => {
    try {
        const orderid = req.params.orderid;
        const orders = await orderModel.findById(orderid);
        if (!orders) {
          res.status(404).json({ msg: "No Order Found" });
        } else {
          res.status(200).json({ msg: orders });
        }
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const getOrderData = async (req, res) => {
  try {
    const orderid = req.params.orderid;
    const orders = await orderModel.findById(orderid);
    if (!orders) {
      res.status(404).json({ msg: "No Order Found" });
    } else {
      res.status(200).json({ msg: orders });
    }
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};


const createOrder = async(req, res) => {
    try {
        const userid = req.body.id;
        const prodid = req.params.prodid;
        const product = await prodModel.findById(prodid);
        if(!product){
            res.status(404).json({"msg": "Product not found"})
        }else{
            let finalPrice = parseInt(product.price);
            if(parseInt(product.discount) > 0){
                finalPrice =
                  (parseInt(product.price) * parseInt(product.discount)) / 100;   
            }
            let newOrder = new orderModel({
              userid,
              prodid,
              price: finalPrice,
              quantity: req.body.quantity,
              pickupLoc: req.body.loc,
              phone: req.body.phone,
              deliveryCharges: 200,
              status: "pending",
              expDate: getExpDate(new Date()),
            });
            product.stock = parseInt(product.stock) - parseInt(req.body.quantity);
            await product.save();
            await newOrder.save();
            res.status(200).json({"msg": "Order Placed, go to the orders section to track your order"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "server error" });
    }
}


const updateOrder = async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}


function cancelationExp(selectedDate) {
  const currentDate = new Date();
  return currentDate.toDateString() === new Date(selectedDate).toDateString();
}

const cancelOrder = async(req, res) => {
    try {
        const orderid = req.params.prodId;
        const order = await orderModel.findById(orderid);
        if(!order){
            res.status(404).json({"msg": "order not found"})
        }else{
            if (cancelationExp(order.date)){
                order.status = "Cancelled";
                await order.save();
                res.status(200).json({"msg": "Order cancelled"})
            }else{
                res.status(400).json({"msg": "Order cannot be cancelled."})
            }
        }
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}


const removeOrder = async(req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

module.exports = {
  getOrders,
  getOrderDetails,
  getAllOrders,
  createOrder,
  updateOrder,
  removeOrder,
  cancelOrder,
  getOrderData,
};