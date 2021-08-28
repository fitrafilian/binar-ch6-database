const mongoose = require("mongoose");
const usersModel = require("../models/users.model");
const biodataModel = require("../models/biodata.model");
const historyModel = require("../models/history.model");
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
      // _id: req.params._id,
    });
    let biodata = await biodataModel.Biodata.findOne({ idUser: req.params._id });
    let histories = await historyModel.History.find({ idUser: req.params._id });
    res.render("dashboard/details", {
      layout: "dashboard/layouts/dashboard-layout",
      title: user.firstName + " " + user.lastName,
      user: user,
      biodata: biodata,
      histories: histories,
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
    }
  },

  update: async (req, res) => {
    let user = await usersModel.User.findOne({
      _id: mongoose.Types.ObjectId(req.params._id),
    });

    res.render("dashboard/update", {
      title: "Update user",
      layout: "dashboard/layouts/dashboard-layout",
      user: user,
    });
  },

  updatePut: async (req, res) => {
    const errors = validationResult(req);
    const { email, firstName, lastName, phone, password, confirmPassword } = req.body;
    const dataUser = await usersModel.User.findOne({ _id: req.body._id });
    let setPassword = "";
    if (dataUser.password == password) {
      setPassword = password;
    } else {
      setPassword = await usersModel.getHashedPassword(password);
    }
    const user = req.body;
    if (!errors.isEmpty()) {
      res.render("dashboard/update", {
        layout: "dashboard/layouts/dashboard-layout",
        title: "Update user",
        errors: errors.array(),
        user: user,
        dataUser: dataUser,
      });
    } else {
      await usersModel.User.updateOne(
        { _id: req.body._id },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            password: setPassword,
            phone: phone,
          },
        }
      ).then(() => {
        res.redirect("/dashboard/user/" + req.body._id);
      });
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
