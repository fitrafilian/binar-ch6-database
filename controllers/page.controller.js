const usersController = require("../controllers/users.controller");
const usersModel = require("../models/users.model");
let dataTokens = usersController.dataTokens;

module.exports = {
  index: (req, res) => {
    if (req.user) {
      res.setHeader("Content-Type", "text/html");
      res.render("index", {
        user: req.user,
        layout: "layouts/main",
        title: "Traditional Games",
      });
    } else {
      res.render("index", {
        title: "Traditional Games",
        layout: "layouts/main",
      });
    }
  },

  auth: (req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies["AuthToken"];

    // Inject the user to the request
    req.user = dataTokens[authToken];

    next();
  },

  games: (req, res) => {
    res.render("games", {
      title: "Rock, Paper, Scissor",
      layout: "layouts/main",
    });
  },
};
