require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, RefreshToken, InvalidToken } = require("../models");

// --- Register ---
const register = async (req, res) => {
  try {
    const { name, email, password, phone, city, street } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

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

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Login ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: Number(process.env.TOKEN_EXPIRE_IN),
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.RJWT_SECRET, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRE_IN),
    });

    await RefreshToken.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRE_IN) * 1000),
    });

    return res.status(200).json({ token, refreshToken, id: user.id, email: user.email });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- Refresh Token ---
const refresh_token = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const savedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!savedToken) return res.status(401).json({ message: "Refresh token invalid or expired" });

    const decoded = jwt.verify(refreshToken, process.env.RJWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await savedToken.destroy();

    const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: Number(process.env.TOKEN_EXPIRE_IN),
    });

    const newRefreshToken = jwt.sign({ id: user.id }, process.env.RJWT_SECRET, {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRE_IN),
    });

    await RefreshToken.create({
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRE_IN) * 1000),
    });

    return res.status(200).json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError)
      return res.status(401).json({ message: "Refresh token invalid or expired" });
    return res.status(500).json({ message: error.message });
  }
};

// --- Current User ---
const current = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "phone", "role", "city", "street"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// --- Logout ---
const logout = async (req, res) => {
  try {
    const decoded = jwt.decode(req.token);
    await InvalidToken.create({
      token: req.token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    await RefreshToken.destroy({ where: { userId: req.user.id } });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, refresh_token, current, logout };
