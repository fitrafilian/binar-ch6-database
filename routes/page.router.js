const express = require("express");
const router = express.Router();
const pageController = require("../controllers/page.controller");
const usersModel = require("../models/users.model");

router.use(pageController.auth);
router.get("/", pageController.index);
router.get("/games", usersModel.requireAuth, pageController.games);
module.exports = router;
