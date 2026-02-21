const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  ensureAuthenticated,
  authorize,
} = require("../middleware/authMiddleware");
const controller = require("../controllers/productControllers");

// Admin
router.post(
  "/admin/add",
  ensureAuthenticated,
  authorize(["admin"]),
  upload.array("images", 5),
  controller.addProduct,
);

router.put(
  "/admin/edit/:id",
  ensureAuthenticated,
  authorize(["admin"]),
  upload.array("images", 5),
  controller.editProduct,
);

router.delete(
  "/admin/delete/:id",
  ensureAuthenticated,
  authorize(["admin"]),
  controller.deleteProduct,
);
router.delete(
  "/image/:imageId",
  ensureAuthenticated,
  authorize(["admin"]),
  controller.deleteProductImage,
);
router.post("/:id/rating", ensureAuthenticated, controller.addStarRating);

// Public
router.get("/", controller.getProducts);
router.get("/:id", controller.getProductDetails);

// User rating
router.post("/:id/rate", ensureAuthenticated, controller.addStarRating);

module.exports = router;
