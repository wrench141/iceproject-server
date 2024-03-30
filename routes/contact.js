const { getInfo, saveInfo, deleteInfo } = require("../controllers/contact.js");

const contactRouter = require("express").Router();

contactRouter.get("/getInfo", getInfo);
contactRouter.post("/saveInfo", saveInfo);
contactRouter.delete("/deleteInfo/:token", deleteInfo);

module.exports = contactRouter;
