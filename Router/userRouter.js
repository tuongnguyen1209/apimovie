const express = require("express");
const verifyToken = require("../middleware/auth");
const userController = require("./../Controller/userController");

const routerUser = express.Router();

routerUser.route("/register").post(userController.register);
routerUser.route("/login").post(userController.login);
routerUser.route("/getuser").get(verifyToken, userController.getUser);

module.exports = routerUser;
