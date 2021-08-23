const express = require("express");
const router = express.Router();
const pageController = require("../controllers/page.controller");

router.use(pageController.auth);
router.get("/", pageController.index);
router.get("/games", pageController.games);
module.exports = router;
