const contactModel = require("../models/contact");



const getInfo = async(req, res) => {
    try {
        const info = await contactModel.find();
        res.status(201).json({"msg": info})
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const saveInfo = async(req, res) => {
    try {
        const {email, desc, phone} = req.body;
        const newInfo = new contactModel({email, desc, phone});
        await newInfo.save();
        res.status(201).json({"msg": "Thankyou for contacting us, we will help you within short time"})
    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }
}

const deleteInfo = async(req, res) => {
    try {
        const id = req.params.id;
        await contactModel.findByIdAndDelete(id);
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
    getInfo,
    saveInfo,
    deleteInfo
}