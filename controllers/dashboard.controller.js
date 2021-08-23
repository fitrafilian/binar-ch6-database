const mongoose = require("mongoose");
const usersModel = require("../models/users.model");
const usersController = require("../controllers/users.controller");
const { body, validationResult, check } = require("express-validator");
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
      message: req.flash("message"),
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

  insertUser: (req, res) => {
    res.render("dashboard/insert", {
      title: "Insert user",
      layout: "dashboard/layouts/dashboard-layout",
    });
  },

  insertUserPost: async (req, res) => {
    const errors = validationResult(req);
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    const hashedPassword = await usersModel.getHashedPassword(password);
    if (!errors.isEmpty()) {
      res.render("dashboard/insert", {
        layout: "dashboard/layouts/dashboard-layout",
        title: "Insert user",
        errors: errors.array(),
      });
    } else {
      await usersModel.User.insertMany(
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
        (err, result) => {
          req.flash("message", "User successfully made");
          res.redirect("/dashboard/users");
        }
      );
      // res.render("dashboard/users", {
      //   layout: "dashboard/layouts/dashboard-layout",
      //   title: "Users Master",
      //   message: "Account successfully created",
      //   messageClass: "alert-success",
      // });
    }
  },

  deleteUser: async (req, res) => {
    await usersModel.User.deleteOne({ _id: mongoose.Types.ObjectId(req.body._id) }).then(() => {
      res.redirect("/dashboard/users");
    });
  },

  homepage: (req, res) => {
    const token = req.token;
    delete dataTokens[token];
    res.clearCookie("AuthToken");
    res.redirect("/");
  },
};
