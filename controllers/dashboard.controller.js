const usersModel = require("../models/users.model");
const usersController = require("../controllers/users.controller");
let dataTokens = usersController.dataTokens;

module.exports = {
  dashboard: (req, res) => {
    if (req.user) {
      res.setHeader("Content-Type", "text/html");
      res.render("dashboard/dashboard", {
        title: "Dashboard",
        layout: "dashboard/layouts/dashboard-layout",
        activeDashboard: "linkActive",
      });
    } else {
      res.render("login", {
        layout: "layouts/main",
        title: "Log In",
        message: "Please login to continue",
        messageClass: "alert-danger",
      });
    }
  },

  users: async (req, res) => {
    let users = await usersModel.User.find();
    res.render("dashboard/users", {
      title: "Users Master",
      layout: "dashboard/layouts/dashboard-layout",
      users: users,
      activeUsers: "linkActive",
    });
  },

  homepage: (req, res) => {
    const token = req.token;
    delete dataTokens[token];
    res.clearCookie("AuthToken");
    res.redirect("/");
  },
};
