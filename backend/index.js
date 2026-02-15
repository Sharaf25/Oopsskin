const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config(); // Load environment variables
const authRouter = require("./routes/authRoutes");
const sequelize = require("./config/db");
const cleanExpiredTokens = require("./utils/cleanExpiredTokens"); // <--- new
const User = require("./models/User");
const cors = require("cors");
app.use(cors());
// Sync tables
sequelize
  .sync() // creates tables if not exists
  .then(() => console.log("Tables are synced"))
  .catch((err) => console.error("Error syncing tables:", err));

  
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/test", authRouter);

// Run cleanup once at startup
cleanExpiredTokens();

// Run cleanup every hour (3600000 ms)
setInterval(cleanExpiredTokens, 3600000);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the JWT Authentication API");
});

// Start server
app.listen(6000, () => {
  console.log("Server is running on port 6000");
});
