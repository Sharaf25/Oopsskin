// middleware/optionalAuth.js
const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // No token → continue as guest
    return next();
  }

  try {
    // Handle both "Bearer <token>" and raw "<token>" formats
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: userId, ... }
  } catch (err) {
    // Invalid token → ignore, continue as guest
  }

  next();
};

module.exports = optionalAuth;
