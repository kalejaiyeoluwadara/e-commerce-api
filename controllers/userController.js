const User = require("../models/User");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(200).json({ msg: users });
};
const getSingleUser = async (req, res) => {
  console.log(req.user);
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("No user with ID ");
  }

  res.status(200).json({ msg: user });
};
const showCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

// update user with user.save
const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    throw new CustomError.BadRequestError("provide all info");
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  await user.save();
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(200).json({ user: tokenUser });
};
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError("provide all info");
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { name, email },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(200).json({ user: tokenUser });
// };
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({ msg: "updated password" });
};
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
