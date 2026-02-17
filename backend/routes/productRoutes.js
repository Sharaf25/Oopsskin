const express = require("express");
const router = express.Router();
const { getProducts } = require("../controllers/productControllers"); // Named import

router.get("/products", getProducts);

module.exports = router;
