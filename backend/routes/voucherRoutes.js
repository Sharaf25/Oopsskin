const router = require("express").Router();
const controller = require("../controllers/voucherController");
const { ensureAuthenticated, authorize } = require("../middleware/authMiddleware");

router.post("/", ensureAuthenticated, authorize("admin"), controller.createVoucher);
router.get("/", ensureAuthenticated, authorize("admin"), controller.getAllVouchers);
router.get("/:id", ensureAuthenticated, authorize("admin"), controller.getVoucherById);
router.put("/:id", ensureAuthenticated, authorize("admin"), controller.updateVoucher);
router.delete("/:id", ensureAuthenticated, authorize("admin"), controller.deleteVoucher);

module.exports = router;
