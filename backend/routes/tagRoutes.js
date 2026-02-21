const express = require("express");
const router = express.Router();
const {
  ensureAuthenticated,
  authorize,
} = require("../middleware/authMiddleware");
const controller = require("../controllers/tagController");

router.post(
  "/add",
  ensureAuthenticated,
  authorize(["admin"]),
  controller.addTag,
);
router.put(
  "/edit/:id",
  ensureAuthenticated,
  authorize(["admin"]),
  controller.editTag,
);
router.delete(
  "/delete/:id",
  ensureAuthenticated,
  authorize(["admin"]),
  controller.deleteTag,
);
router.get("/", controller.getAllTags);

module.exports = router;
