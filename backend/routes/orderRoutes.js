const router = require("express").Router();
const { checkout } = require("../controllers/orderController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

router.post("/checkout", ensureAuthenticated, checkout);

module.exports = router;
