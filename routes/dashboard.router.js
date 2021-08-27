const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");
const usersModel = require("../models/users.model");
const dashboardModel = require("../models/dashboard.model");
// const usersModel = { requireAuth: [] };

router.get("/", usersModel.requireAuth, dashboardController.dashboard);
router.get("/users", usersModel.requireAuth, dashboardController.users);
router.get("/user/insert", usersModel.requireAuth, dashboardController.insertUser);
router.post("/user/insert", usersModel.registerValidator, dashboardController.insertUserPost);
router.get("/user/:_id", usersModel.requireAuth, dashboardController.details);
router.get("/user/update/:_id", usersModel.requireAuth, dashboardController.update);
router.put("/user/update", dashboardModel.updateValidator, dashboardController.updatePut);
router.delete("/user", dashboardController.deleteUser);
router.get("/homepage", usersModel.requireAuth, dashboardController.homepage);

module.exports = router;
