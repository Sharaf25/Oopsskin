require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, RefreshToken, InvalidToken } = require("../models");

// ========================================
// 1️⃣ REGISTER
// ========================================
const register = async (req, res) => {
  try {
    const { name, email, password, phone, city, street } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      street,
      role: "user",
    });

    return res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ========================================
// 2️⃣ LOGIN
// ========================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: Number(process.env.TOKEN_EXPIRE_IN) },
    );

    const refreshToken = jwt.sign({ id: user.id }, process.env.RJWT_SECRET, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRE_IN),
    });

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRE_IN) * 1000,
      ),
    });

    return res.status(200).json({
      token,
      refreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ========================================
// 3️⃣ REFRESH TOKEN
// ========================================
const refresh_token = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const savedToken = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!savedToken) {
      return res.status(401).json({ message: "Refresh token invalid" });
    }

    // Check expiration in DB
    if (savedToken.expiresAt < new Date()) {
      await savedToken.destroy();
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const decoded = jwt.verify(refreshToken, process.env.RJWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old refresh token
    await savedToken.destroy();

    // Create new tokens
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: Number(process.env.TOKEN_EXPIRE_IN) },
    );

    const newRefreshToken = jwt.sign({ id: user.id }, process.env.RJWT_SECRET, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRE_IN),
    });

    await RefreshToken.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRE_IN) * 1000,
      ),
    });

    return res.status(200).json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Refresh token invalid or expired" });
  }
};

// ========================================
// 4️⃣ CURRENT USER
// ========================================
const current = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone", "role", "city", "street"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ========================================
// 5️⃣ LOGOUT
// ========================================
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Blacklist access token
    await InvalidToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    // Remove all refresh tokens for this user
    await RefreshToken.destroy({
      where: { userId: decoded.id },
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh_token,
  current,
  logout,
};
