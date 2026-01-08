import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendCredentialsEmail } from "../email.js";

const router = express.Router();

// helper to generate random strings
function randomString(length = 8) {
  return Math.random().toString(36).slice(-length);
}

/**
 * REGISTER
 * Receives: name, email
 * Generates: username, password
 * Sends email with credentials
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const username =
      name.toLowerCase().replace(/\s+/g, "") + randomString(4);

    const plainPassword = randomString(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await sendCredentialsEmail(email, username, plainPassword);

    res.json({
      message: "Registration successful. Credentials sent to email.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

/**
 * LOGIN
 * Receives: username/email + password
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
