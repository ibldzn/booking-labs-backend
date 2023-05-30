const Router = require("express").Router();

const { getUser } = require("../controllers/user.controller");

Router.get("/users/:id", getUser);

module.exports = Router;
