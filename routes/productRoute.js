const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const express = require("express");
const {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");
const router = express.Router();
router
  .route("/")
  .get(getAllProducts)
  .post([authenticateUser, authorizePermissions("admin")], createProduct);
router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin")], uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct);

module.exports = router;
