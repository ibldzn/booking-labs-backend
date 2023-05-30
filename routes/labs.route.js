const Router = require("express").Router();

const {
  getAllLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab,
} = require("../controllers/labs.controller");

Router.get("/labs", getAllLabs);
Router.get("/labs/:id", getLabById);
Router.post("/labs", createLab);
Router.put("/labs/:id", updateLab);
Router.delete("/labs/:id", deleteLab);

module.exports = Router;
