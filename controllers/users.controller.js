const usersModel = require("../models/users.model");
const { body, validationResult, check } = require("express-validator");
const mongoose = require("mongoose");

let dataTokens = {};

module.exports = {
  register: (req, res) => {
    res.render("register", {
      title: "Register",
      layout: "layouts/main",
    });
  },

  login: (req, res) => {
    res.render("login", {
      layout: "layouts/main",
      title: "Log In",
    });
  },

  postRegister: async (req, res) => {
    const errors = validationResult(req);
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    const hashedPassword = await usersModel.getHashedPassword(password);
    if (!errors.isEmpty()) {
      res.render("register", {
        layout: "layouts/main",
        title: "Register",
        errors: errors.array(),
      });
    } else {
      await usersModel.User.insertMany({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      res.render("login", {
        layout: "layouts/main",
        title: "Log In",
        message: "Account successfully created",
        messageClass: "alert-success",
      });
    }
  },

  postLogin: async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = usersModel.getHashedPassword(password);

    const user = await usersModel.User.findOne({
      email: email,
      password: hashedPassword,
    });

    let emailAdmin = "";
    if (email == "admin@admin.com") {
      emailAdmin = email;
    }

    const admin = await usersModel.User.findOne({
      email: emailAdmin,
      password: hashedPassword,
    });

    if (admin) {
      const authToken = usersModel.generateAuthToken();
      const time = usersModel.getTime();
      user.time = time;

      // Store authentication token
      dataTokens[authToken] = user;

      // Setting the auth token in cookies
      res.cookie("AuthToken", authToken, {
        expires: new Date(Date.now() + 900000),
      });
      res.redirect("/dashboard");
    } else if (user) {
      const authToken = usersModel.generateAuthToken();
      const time = usersModel.getTime();
      user.time = time;

      // Store authentication token
      dataTokens[authToken] = user;

      // Setting the auth token in cookies
      res.cookie("AuthToken", authToken, {
        expires: new Date(Date.now() + 900000),
      });

      // Redirect user to the user page
      res.redirect("/");
    } else {
      res.render("login", {
        layout: "layouts/main",
        title: "Log In",
        message: "Invalid username or password",
        messageClass: "alert-danger",
      });
    }
  },

  updatePut: async (req, res) => {
    const errors = validationResult(req);
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    const dataUser = await usersModel.User.findOne(mongoose.Types.ObjectId(req.user._id));
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
          },
        }
      ).then(() => {
        res.redirect("/");
      });
    }
  },

  profile: async (req, res) => {
    let user = await usersModel.User.findOne({ email: req.user.email });
    res.render("profile", {
      layout: "layouts/main",
      title: "Profile",
      user: user,
    });
  },

  updateProfile: async (req, res) => {
    const errors = validationResult(req);
    const { email, firstName, lastName, phone } = req.body;
    const dataUser = await usersModel.User.findOne({ _id: req.user._id });
    const user = req.user;
    if (!errors.isEmpty()) {
      res.render("profile", {
        layout: "layouts/main",
        title: "Update user",
        errors: errors.array(),
        user: user,
        dataUser: dataUser,
      });
    } else {
      await usersModel.User.updateOne(
        { _id: req.user._id },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
          },
        }
      ).then(() => {
        res.redirect("/user/profile");
      });
    }
  },

  updatePassword: async (req, res) => {
    const errors = validationResult(req);
    const { oldPassword, password, confirmPassword } = req.body;
    const hashedPassword = await usersModel.getHashedPassword(password);
    const dataUser = await usersModel.User.findOne({ _id: req.user._id });
    const user = req.user;
    if (!errors.isEmpty()) {
      res.render("profile", {
        layout: "layouts/main",
        title: "Update User",
        errors: errors.array(),
        user: user,
        dataUser: dataUser,
      });
    } else {
      await usersModel.User.updateOne(
        { _id: req.user._id },
        {
          $set: {
            password: hashedPassword,
          },
        }
      ).then(() => {
        res.redirect("/user/profile");
      });
    }
  },

  logout: (req, res) => {
    const token = req.token;
    delete dataTokens[token];
    res.clearCookie("AuthToken");
    res.redirect("/");
  },

  dataTokens,
};
