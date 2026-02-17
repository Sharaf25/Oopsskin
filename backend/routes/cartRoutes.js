const router = require("express").Router();
const controller = require("../controllers/cartController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

router.post("/add", ensureAuthenticated, controller.addToCart);
router.get("/", ensureAuthenticated, controller.getCart);
router.put("/item/:itemId", ensureAuthenticated, controller.updateQuantity);
router.delete("/item/:itemId", ensureAuthenticated, controller.removeItem);

module.exports = router;
