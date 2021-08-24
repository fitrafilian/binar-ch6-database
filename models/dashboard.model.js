const { body, validationResult, check } = require("express-validator");
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

module.exports = { updateValidator };
