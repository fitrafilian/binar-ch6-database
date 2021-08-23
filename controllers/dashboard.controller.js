const mongoose = require("mongoose");
const usersModel = require("../models/users.model");
const usersController = require("../controllers/users.controller");
let dataTokens = usersController.dataTokens;

module.exports = {
  dashboard: (req, res) => {
    res.render("dashboard/dashboard", {
      title: "Dashboard",
      layout: "dashboard/layouts/dashboard-layout",
      activeDashboard: "linkActive",
    });
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

  details: async (req, res) => {
    let user = await usersModel.User.findOne({
      _id: mongoose.Types.ObjectId(req.params._id),
    });

    res.render("dashboard/details", {
      layout: "dashboard/layouts/dashboard-layout",
      title: user.firstName + " " + user.lastName,
      user: user,
    });
  },

  homepage: (req, res) => {
    const token = req.token;
    delete dataTokens[token];
    res.clearCookie("AuthToken");
    res.redirect("/");
  },
};
