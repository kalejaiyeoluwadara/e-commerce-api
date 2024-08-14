require("dotenv").config();
const User = require("../models/User");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");
const register = async (req, res) => {
  const { email, name, password } = req.body;

  // Check if it's the first user (to assign admin role)
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  // Create user
  const user = await User.create({ email, name, password, role });

  // Create token payload
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(201).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide both email and password"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  // Create token payload
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(201).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  });
  res.status(200).json({ msg: "User logged out" });
};

module.exports = { register, login, logout };
