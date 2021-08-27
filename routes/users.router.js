const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const usersModel = require("../models/users.model");

// router.use(usersController.auth);
router.get("/register", usersController.register);
router.get("/login", usersController.login);
router.post("/register", usersModel.registerValidator, usersController.postRegister);
router.post("/login", usersController.postLogin);
router.put("/update", usersModel.updateValidator, usersController.updatePut);
router.get("/profile", usersController.profile);
router.put("/profile/update", usersModel.profileValidator, usersController.updateProfile);
router.put("/password/update", usersModel.passwordValidator, usersController.updatePassword);
router.get("/logout", usersController.logout);

module.exports = router;
