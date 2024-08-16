const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { CheckPermission } = require("../utils");

const getAllOrders = async (req, res) => {
  res.send("All Orders");
};
const getSingleOrder = async (req, res) => {
  res.send("single order");
};
const getCurrentUserOrders = async (req, res) => {
  res.send("current user order");
};
const createOrder = async (req, res) => {
  res.send("create order");
};

const updateOrder = async (req, res) => {
  res.send("update order");
};
module.exports = {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
};
