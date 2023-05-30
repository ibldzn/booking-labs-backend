const Router = require("express").Router();

const {
  register,
  login,
  logout,
  me,
} = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middlewares/app.authentication");

Router.post("/auth/register", register);
Router.post("/auth/login", login);
Router.post("/auth/logout", isAuthenticated, logout);
Router.get("/auth/me", isAuthenticated, me);

module.exports = Router;
