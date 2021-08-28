const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const usersModel = require("../models/users.model");

router.get("/register", usersController.register);
router.get("/login", usersController.login);
router.post("/register", usersModel.registerValidator, usersController.postRegister);
router.post("/login", usersController.postLogin);
router.put("/update", usersModel.updateValidator, usersController.updatePut);
router.use(usersController.auth);
router.get("/profile", usersController.profile);
router.put("/profile/update", usersModel.profileValidator, usersController.updateProfile);
router.put("/password/update", usersModel.passwordValidator, usersController.updatePassword);
router.put("/biodata/update", usersController.biodataUpdate);
router.post("/history", usersController.history);
router.get("/logout", usersController.logout);

module.exports = router;
