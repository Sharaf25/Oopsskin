const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  authorize,
} = require("../middleware/authMiddleware");
const controller = require("../controllers/categoryController");

router.post(
  "/add",
  ensureAuthenticated,
  authorize(["admin"]),
  controller.addCategory,
);
router.put(
  "/edit/:id",
  ensureAuthenticated,
  authorize(["admin"]),
  controller.editCategory,
);
router.delete(
  "/delete/:id",
  ensureAuthenticated,
  authorize(["admin"]),
  controller.deleteCategory,
);
router.get("/", controller.getAllCategories);

module.exports = router;
