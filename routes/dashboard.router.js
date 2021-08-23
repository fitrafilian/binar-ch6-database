const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const usersModel = require("../models/users.model");

router.get("/", usersModel.requireAuth, dashboardController.dashboard);
router.get("/users", usersModel.requireAuth, dashboardController.users);
router.get("/user/insert", usersModel.requireAuth, dashboardController.insertUser);
router.post("/user/insert", usersModel.registerValidator, dashboardController.insertUserPost);
router.get("/user/:_id", usersModel.requireAuth, dashboardController.details);
router.delete("/user", dashboardController.deleteUser);
router.get("/homepage", usersModel.requireAuth, dashboardController.homepage);

module.exports = router;
