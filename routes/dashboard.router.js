const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

router.get("/", dashboardController.dashboard);
router.get("/users", dashboardController.users);
router.get("/homepage", dashboardController.homepage);

module.exports = router;
