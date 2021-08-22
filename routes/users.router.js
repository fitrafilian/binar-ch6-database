const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const usersModel = require("../models/users.model");

router.get("/register", usersController.register);
router.get("/login", usersController.login);
router.post(
  "/register",
  usersModel.registerValidator,
  usersController.postRegister
);
router.post("/login", usersController.postLogin);
router.get("/logout", usersController.logout);

module.exports = router;
