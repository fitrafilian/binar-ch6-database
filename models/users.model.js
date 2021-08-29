const mongoose = require("mongoose");

const User = mongoose.model("user", {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
});

const crypto = require("crypto");
// Hash password
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};

const { body, validationResult, check } = require("express-validator");
const registerValidator = [
  check("email", "Email is not valid").isEmail(),
  body("email").custom(async (value) => {
    const duplicate = await User.findOne({ email: value });
    if (duplicate) {
      throw new Error("Email is already exist!");
    }
    return true;
  }),
  check("password", "Password at least 8 characters in length.").isLength({
    min: 8,
  }),
  check("confirmPassword", "Password at least 8 characters in length.").isLength({ min: 8 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

const getTime = function () {
  const date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var seconds = date.getSeconds();
  var timeNow = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  return timeNow;
};

const requireAuth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.render("login", {
      layout: "layouts/main",
      title: "Log In",
      message: "Please login to continue",
      messageClass: "alert-danger",
    });
  }
};

const updateValidator = [
  // check("email", "Email is not valid").isEmail(),
  // body("email").custom(async (value) => {
  //   const duplicate = await User.findOne({ email: value });
  //   if (value != req.body.oldEmail && duplicate) {
  //     throw new Error("Email is already exist!");
  //   }
  //   return true;
  // }),
  check("password", "Password at least 8 characters in length.").isLength({
    min: 8,
  }),
  check("confirmPassword", "Password at least 8 characters in length.").isLength({ min: 8 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

// const profileValidator = [check("phone", "Phone number is not valid!").isMobilePhone("id-ID")];

const profileValidator = []
//   body("phone").custom((value, { req }) => {
//     if (value.length == 0) {
//       return true;
//     } else if (value.isMobilePhone("id-ID")) {
//       return true;
//     } else {
//       throw new Error("Phone number is not valid!");
//     }
//   }),
// ];

const passwordValidator = [
  body("oldPassword").custom(async (value, { req }) => {
    hashedOldPassword = getHashedPassword(value);
    const duplicate = await User.findOne({ email: req.user.email });
    if (duplicate.password !== hashedOldPassword) {
      throw new Error("Password doesn't match!");
    }
    return true;
  }),
  check("password", "Password at least 8 characters in length.").isLength({
    min: 8,
  }),
  check("confirmPassword", "Password at least 8 characters in length.").isLength({ min: 8 }),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

module.exports = {
  User,
  getHashedPassword,
  generateAuthToken,
  registerValidator,
  getTime,
  requireAuth,
  updateValidator,
  profileValidator,
  passwordValidator,
};
