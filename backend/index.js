const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const cleanExpiredTokens = require("./utils/cleanExpiredTokens");

// Routers
const authRouter = require("./routes/authRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const voucherRouter = require("./routes/voucherRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin/vouchers", voucherRouter);

// Mount product routes under /api
app.use("/api", productRoutes);

// Default route
app.get("/", (req, res) => res.send("Welcome to the API"));

// Sync database tables
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Tables are synced"))
  .catch((err) => console.error("❌ Error syncing tables:", err));

// Run cleanup once at startup and every hour
cleanExpiredTokens();
setInterval(cleanExpiredTokens, 60 * 60 * 1000);

// Error handling for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
