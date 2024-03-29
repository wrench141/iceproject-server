const orderModel = require("../models/order.js");
const prodModel = require("../models/product.js");
const mail = require("../utils/ack.js");


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
            const html = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Order Information</title>
                                <style>
                                    body {
                                        font-family: Arial, sans-serif;
                                        margin: 0;
                                        padding: 0;
                                    }

                                    .container {
                                        max-width: 800px;
                                        margin: 0 auto;
                                        padding: 20px;
                                    }

                                    h1, h2, h3 {
                                        text-align: center;
                                    }

                                    .order-info {
                                        margin-top: 30px;
                                    }

                                    .order-details {
                                        background-color: #f2f2f2;
                                        padding: 20px;
                                        border-radius: 5px;
                                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                    }

                                    .order-details h3 {
                                        margin-top: 0;
                                    }

                                    p {
                                        margin: 10px 0;
                                    }

                                    strong {
                                        font-weight: bold;
                                    }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h1>Frosty Creations</h1>
                                    <h2>Order Information</h2>
                                    <div class="order-info">
                                        <div class="order-details">
                                            <h3>Order Details</h3>
                                            <p><strong>Product Name:</strong> <span id="product-name"></span></p>
                                            <p><strong>Category:</strong> <span id="category"></span></p>
                                            <p><strong>Quantity:</strong> <span id="quantity"></span></p>
                                            <p><strong>Price:</strong> <span id="price"></span></p>
                                            <p><strong>Expire Date:</strong> <span id="order-date"></span></p>
                                            <p><strong>Address:</strong> <span id="address"></span></p>
                                            <p><strong>Order Status:</strong> <span id="order-status"></span></p>
                                        </div>
                                    </div>
                                </div>

                                <script>
                                    const orderData = {
                                        productName: ${product.prodname},
                                        category: ${product.category},
                                        quantity: ${req.body.quantity},
                                        price: ${finalPrice},
                                        date: ${getExpDate(new Date())},
                                        address: ${req.body.loc},
                                        orderStatus: "Pending"
                                    };

                                    document.getElementById("product-name").textContent = orderData.productName;
                                    document.getElementById("category").textContent = orderData.category;
                                    document.getElementById("quantity").textContent = orderData.quantity;
                                    document.getElementById("price").textContent = orderData.price;
                                    document.getElementById("order-date").textContent = orderData.date;
                                    document.getElementById("address").textContent = orderData.address;
                                    document.getElementById("order-status").textContent = orderData.orderStatus;
                                </script>
                            </body>
                            </html>`;
            await mail("Order confirmed", html, process.env.ADMIN_MAIL)
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