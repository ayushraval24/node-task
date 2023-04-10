const { body } = require("express-validator/check");

exports.registrationValidator = [
  body("email").not().isEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("full_name").not().isEmpty().withMessage("Full Name is required"),
  body("phone").not().isEmpty().withMessage("Phone number is required"),
  body("date_of_birth")
    .not()
    .isEmpty()
    .withMessage("Date of birth is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

exports.loginValidator = [
  body("email").not().isEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password").not().isEmpty().withMessage("Password is required"),
];
