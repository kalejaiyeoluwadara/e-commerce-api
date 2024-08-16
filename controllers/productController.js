const Product = require("../models/Product");
const customError = require("../errors");
const path = require("path");
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(201).json({ product });
  res.send("Create product");
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).select("-user").populate("reviews");
  res.status(200).json({ products, count: products.length });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new customError.NotFoundError(`No product with id: ${productId}`);
  }
  res.status(200).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new customError.NotFoundError(`No product with id: ${productId}`);
  }
  res.status(200).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new customError.NotFoundError(`No product with id: ${productId}`);
  }
  await product.remove();
  res.status(200).json({ msg: "product removed" });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new customError.BadRequestError("no file provided");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new customError.BadRequestError("please upload image");
  }
  const maxsize = 1024 * 1024;
  if (productImage.size > maxsize) {
    throw new customError.BadRequestError(
      "please upload image smaller than 1mb"
    );
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(200).json({ image: `/uploads/${productImage.name}` });
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
