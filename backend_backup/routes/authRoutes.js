const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh_token,
  current,
  logout,
} = require("../controllers/authController");
const { ensureAuthenticated, authorize } = require("../middleware/authMiddleware");


router.post("/register", register);
router.post("/login", login);
router.post("/refresh_token", refresh_token);
router.post("/logout", ensureAuthenticated, logout);
router.get("/current", ensureAuthenticated, current);

// Example admin route
// router.get("/admin", ensureAuthenticated, authorize(["admin"]), (req, res) => {
//   res.status(200).json({ message: "Only admins" });
// });
// Only admin

// router.get("/admin", ensureAuthenticated, authorize(["admin"]), (req, res) => {
//   res.json({ message: `Hello Admin ${req.user.id}!` });
// });

// // Any logged-in user
// router.get("/user", ensureAuthenticated, (req, res) => {
//   res.json({ message: `Hello User ${req.user.id}!` });
// });

module.exports = router;


