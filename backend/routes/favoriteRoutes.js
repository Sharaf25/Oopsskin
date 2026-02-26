const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const controller = require("../controllers/favoriteController");

// Add / Remove favorite
router.post("/:id", ensureAuthenticated, controller.toggleFavorite);

// Get user favorites
router.get("/", ensureAuthenticated, controller.getUserFavorites);

module.exports = router;