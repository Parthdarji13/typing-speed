import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { sendCredentialsEmail } from "../email.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("🔥 NEW REGISTER ROUTE HIT");

  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // ✅ Get current time (HH:MM format as HHMM)
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeCode = hours + minutes; // e.g., "1720"

    // ✅ Create username: cleanname_ts
    const cleanName = name.replace(/\s+/g, '').toLowerCase();
    const username = `${cleanName}_ts`;

    // ✅ Create password: CapitalizedName@TS{time}
    const capitalizedName = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    
    const plainPassword = `${capitalizedName}@TS${timeCode}`;

    // ✅ Hash password securely
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // respond immediately
    res.status(201).json({
      message: "Registration successful. Credentials will be sent to your email.",
    });

    // fire-and-forget email
    sendCredentialsEmail(email, username, plainPassword);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

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

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
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
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;