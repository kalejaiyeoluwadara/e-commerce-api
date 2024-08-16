const Order = require("../models/Order");
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
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError("No product with id");
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  console.log(orderItems);
  console.log(subtotal);

  res.send("create order!");
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
