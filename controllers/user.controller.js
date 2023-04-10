const User = require("../models/User.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registration = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const error = {
        status: 422,
        message: err.errors[0].msg,
        params: err.errors[0].param,
      };
      return next(error);
    }
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email: req.body.email,
      full_name: req.body.full_name,
      phone: req.body.phone,
      DOB: req.body.date_of_birth,
      password: hashedPassword,
    };
    if (req.file) {
      data["profile_image"] = req.file.filename;
    }

    const isUser = await User.findOne({ email: data.email });
    if (isUser) {
      return res.status(402).json({
        error: "User already exists",
      });
    }

    const user = await User.create(data);

    return res.status(201).json({
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      const error = {
        status: 422,
        message: err.errors[0].msg,
        params: err.errors[0].param,
      };
      return next(error);
    }

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(402).json({ message: "Invalid credentials" });
    }

    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) {
      return res.status(402).json({ message: "Invalid credentials" });
    }

    const secret = process.env.JWT;
    const jwtToken = jwt.sign({ id: user._id, email: user.email }, secret);

    return res
      .status(200)
      .json({ message: "User logged in successfully", token: jwtToken });
  } catch (err) {
    next(err);
  }
};

exports.myProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        error: { message: "Invalid Token" },
      });
    }
    return res.status(200).json({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const query = req.query.search;
    const users = await User.find({
      full_name: {
        $regex: query,
        $options: "i",
      },
    });

    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};
