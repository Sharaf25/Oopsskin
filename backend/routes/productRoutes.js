const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  ensureAuthenticated,
  authorize,
} = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth"); // 🔥 new
const controller = require("../controllers/productControllers");

// ----------------------
// Admin Routes
// ----------------------
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

// ----------------------
// Public Routes (Optional Auth)
// ----------------------
router.get("/", optionalAuth, controller.getProducts); // 🔥 optionalAuth added
router.get("/:id", optionalAuth, controller.getProductDetails); // 🔥 optionalAuth added

// ----------------------
// User Rating
// ----------------------
router.post("/:id/rate", ensureAuthenticated, controller.addStarRating);

module.exports = router;
