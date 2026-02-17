const jwt = require("jsonwebtoken");
const { InvalidToken } = require("../models");
require("dotenv").config();

const ensureAuthenticated = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Access token required" });

  if (token.startsWith("Bearer ")) token = token.slice(7).trim();

  try {
    // Check if token is invalidated
    const invalid = await InvalidToken.findOne({ where: { token } });
    if (invalid) return res.status(401).json({ message: "Access token invalidated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    req.token = token; // store current token for logout
    next();
  } catch (error) {
    return res.status(401).json({ message: "Access token not valid" });
  }
};

const authorize = (roles = []) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
};

module.exports = { ensureAuthenticated, authorize };
