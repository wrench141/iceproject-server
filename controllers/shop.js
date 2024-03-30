const shopModel = require("../models/shop");



const getBrands = async(req, res) => {
    try {
        const info = await shopModel.find();
        const shopBrands = info?.map((shop) => {return shop.email});
        res.status(201).json({"msg": shopBrands})
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const getBrand = async(req, res) => {
    try {
        const id = req.params.id
        const shop = await shopModel.findById(id);
        res.status(201).json({"msg": shop})
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const saveShopInfo = async(req, res) => {
    try {
        const { name, email, address, phone } = req.body;
        const newInfo = new shopModel({ name, email, address, phone });
        await newInfo.save();
        res.status(201).json({"msg": "New Tieup added."})
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "server error" });
    }
}

const updateShopInfo = async(req, res) => {
    try {
        const id = req.params.id
        const { name, email, address, phone } = req.body;
        const shop = await shopModel.findById(id);
        if(!shop){
            res.status(404).json({"msg": "Shop not found"});
        }else{
            shop.name = name;
            shop.email = email; 
            shop.address = address;
            shop.phone = phone;
            await shop.save();
            res.status(200).json({"msg": "Shop Details updated."})
        }
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const deleteShopInfo = async(req, res) => {
    try {
        const id = req.params.id;
        await shopModel.findByIdAndDelete(id);
        res
          .status(201)
          .json({
            msg: "Review removed",
          });
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}


module.exports = {
    getBrand,
    getBrands,
    saveShopInfo,
    deleteShopInfo,
    updateShopInfo
}