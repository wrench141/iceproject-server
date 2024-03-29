const prodModel = require("../models/product");
const handleUpload = require("../utils/uploader");
const cloudinary = require("cloudinary");


const getProducts = async(req, res) => {
  try {
    const products = await prodModel.find();
    console.log(products)
    if(products.length === 0){
      res.status(200).json({"msg": []})
    }else{
      res.status(200).json({"msg": products})
    }
  } catch (error) {
    res.status(500).json({"msg": "server error"})
  }
}

const getProduct = async(req, res) => {
  try {
    const prodid = req.params.id;
    const product = await prodModel.findById(prodid);
    if(!product){
      res.status(404).json({"msg":"product not found"});
    }else{
      res.status(200).json({"msg": product})
    }
  } catch (error) {
    res.status(500).json({"msg": "server error"})
  }
}


const createProduct = async (req, res) => {
  try {
    const {
      prodname,
      description,
      category,
      keywords,
      price,
      stock,
      discount,
    } = req.body;

    const newProduct = new prodModel({
      prodname,
      description,
      category,
      keywords,
      price,
      stock,
      discount,
    });

    await newProduct.save();
    res.status(201).json({ msg: "New product created"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const uploadImage = async(req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const file = req.body.file
    const product = await prodModel.findById(id);
    if(!product){
      res.status(404).json({"msg": "Product not found"})
    }else{
      const respImg = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
      });
      product.prodimages = [...product.prodimages, respImg.secure_url];
      await product.save();
      res.status(200).json({"msg": "New image added"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" });
    
  }
}


const updateProduct = async (req, res) => {
  try {
    const {
      prodname,
      description,
      category,
      keywords,
      price,
      stock,
      discount,
    } = req.body;
    const prodid = req.params.prodId;
    const product = await prodModel.findById(prodid);
    if (!product) {
      res.status(404).json({ msg: "no such product found" });
    }else{
      product.prodname = prodname
      product.description = description
      product.category = category
      product.keywords = keywords
      product.price = price
      product.stock = stock
      product.discount = discount;

      await product.save();
      res.status(200).json({"msg": "Product updated"})
    }
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const prodid = req.params.prodId;
    await prodModel.findByIdAndDelete(prodid);
    res.status(200).json({"msg":"Deleted Successfully!"});
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};



module.exports = {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};