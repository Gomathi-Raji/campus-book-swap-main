import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = Router();

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, role: "user" });
    const token = generateToken(user._id);

    res.status(201).json({ user: user.toJSON(), token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.json({ user: user.toJSON(), token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

// GET /api/auth/me — get current user from token
router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user.toJSON() });
});

// GET /api/auth/users — admin: list all non-admin users
router.get("/users", authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users.map((u) => u.toJSON()));
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/auth/users/:id — admin: delete a user
router.delete("/users/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
