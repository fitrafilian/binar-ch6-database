const usersModel = require("../models/users.model");
const { body, validationResult, check } = require("express-validator");

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
        email,
        firstName,
        lastName,
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

    if (user) {
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

  logout: (req, res) => {
    const token = req.token;
    delete dataTokens[token];
    res.clearCookie("AuthToken");
    res.redirect("/");
  },

  dataTokens,
};
