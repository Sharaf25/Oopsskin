const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { sequelize, Product } = require("./models"); // make sure Product is imported
const cleanExpiredTokens = require("./utils/cleanExpiredTokens");

// Routers
const authRouter = require("./routes/authRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const voucherRouter = require("./routes/voucherRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tagRoutes = require("./routes/tagRoutes");

const createDummyData = require("./seeders/dummyData"); // Import seeder

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Serving static files from:', path.join(__dirname, 'uploads'));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin/vouchers", voucherRouter);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);

// Default route
app.get("/", (req, res) => res.send("Welcome to the API"));

// Sync database tables AND run dummy data seeder
sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("✅ Tables are synced");

    // Only create dummy data if products table is empty
    const count = await Product.count();
    if (count === 0) {
      await createDummyData();
    }
  })
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
