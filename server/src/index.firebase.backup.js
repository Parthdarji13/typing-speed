import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { connectMongoDB } from "./mongodb.js";
import { User } from "./models/User.js";
import { Progress } from "./models/Progress.js";
import { createMailer } from "./email.js";

dotenv.config();

const app = express();

// Configuration
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Middleware
app.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json());

// Connect to MongoDB on startup
connectMongoDB().catch((err) => {
	console.error("Failed to connect to MongoDB:", err);
	process.exit(1);
});

// In-memory store for demo purposes (legacy)
const userIdToProgress = new Map();

// Helpers
function generateUsernameFromName(name) {
	const base = name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "")
		.slice(0, 20);
	const suffix = crypto.randomBytes(2).toString("hex");
	return `${base || "user"}-${suffix}`;
}

// Routes
app.get("/health", (req, res) => {
	res.status(200).json({ status: "ok", service: "typing-backend", database: "mongodb" });
});

// Registration using MongoDB: create user with random password and email credentials
app.post("/auth/register", async (req, res) => {
	try {
		const { name, email } = req.body || {};
		if (!name || !email) {
			return res.status(400).json({ error: "name and email are required" });
		}

		const emailLower = email.toLowerCase().trim();

		// Check if user exists
		let existingUser = await User.findOne({ email: emailLower });

		let username;
		let tempPassword = crypto.randomBytes(12).toString("base64url");

		if (existingUser) {
			// User exists - update password
			username = existingUser.username;
			existingUser.name = name;
			existingUser.password = tempPassword; // Will be hashed by pre-save hook
			await existingUser.save();
		} else {
			// Create new user
			username = generateUsernameFromName(name);
			// Check if username already exists
			let usernameExists = await User.findOne({ username });
			if (usernameExists) {
				username = `${username}-${crypto.randomBytes(2).toString("hex")}`;
			}

			existingUser = new User({
				name,
				email: emailLower,
				username,
				password: tempPassword, // Will be hashed by pre-save hook
				emailVerified: false,
			});
			await existingUser.save();
		}

		// Email credentials
		const mailer = createMailer();
		await mailer.sendCredentialsEmail({
			to: emailLower,
			username: existingUser.username,
			password: tempPassword,
		});

		return res.status(200).json({
			message: "Credentials sent to email",
			userId: existingUser._id.toString(),
			username: existingUser.username,
		});
	} catch (err) {
		console.error("Register error:", err);
		if (err.code === 11000) {
			// Duplicate key error
			return res.status(400).json({ error: "Email or username already exists" });
		}
		return res.status(500).json({ error: "Registration failed" });
	}
});

// Legacy in-memory progress (kept for reference/testing)
app.get("/api/progress/:userId", (req, res) => {
	const { userId } = req.params;
	const progress = userIdToProgress.get(userId) || { levels: {}, updatedAt: null };
	res.json({ userId, progress });
});

app.post("/api/progress/:userId", (req, res) => {
	const { userId } = req.params;
	const { progress } = req.body || {};
	if (!progress || typeof progress !== "object") {
		return res.status(400).json({ error: "Invalid progress payload" });
	}
	const enriched = {
		...progress,
		updatedAt: new Date().toISOString(),
	};
	userIdToProgress.set(userId, enriched);
	res.status(200).json({ userId, progress: enriched });
});

// MongoDB-backed progress by email
app.get("/api/progress-by-email/:email", async (req, res) => {
	try {
		const { email } = req.params;
		if (!email) return res.status(400).json({ error: "email required" });

		const emailLower = email.toLowerCase().trim();
		const user = await User.findOne({ email: emailLower });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		let progressDoc = await Progress.findOne({ email: emailLower });

		if (!progressDoc) {
			// Create default progress if doesn't exist
			progressDoc = new Progress({
				userId: user._id,
				email: emailLower,
				progress: {
					easy: {
						level1: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
						level2: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
						level3: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
					},
					medium: {
						level1: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
						level2: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
						level3: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
					},
					hard: {
						level1: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
						level2: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
						level3: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
					},
					impossible: {
						level1: { completed: false, bestWpm: 0, bestAccuracy: 0, completedAt: null },
					},
					totalCompleted: 0,
					totalLevels: 10,
					lastPlayed: null,
				},
			});
			await progressDoc.save();
		}

		return res.json({
			userId: user._id.toString(),
			email: user.email,
			progress: progressDoc.progress,
			updatedAt: progressDoc.updatedAt,
		});
	} catch (err) {
		console.error("Get progress error:", err);
		return res.status(500).json({ error: "Failed to load progress" });
	}
});

app.post("/api/progress-by-email/:email", async (req, res) => {
	try {
		const { email } = req.params;
		const { progress } = req.body || {};
		if (!email) return res.status(400).json({ error: "email required" });
		if (!progress || typeof progress !== "object") {
			return res.status(400).json({ error: "Invalid progress payload" });
		}

		const emailLower = email.toLowerCase().trim();
		const user = await User.findOne({ email: emailLower });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		let progressDoc = await Progress.findOne({ email: emailLower });

		if (!progressDoc) {
			progressDoc = new Progress({
				userId: user._id,
				email: emailLower,
				progress,
			});
		} else {
			progressDoc.progress = progress;
			progressDoc.updatedAt = new Date();
		}

		await progressDoc.save();

		return res.status(200).json({
			userId: user._id.toString(),
			email: user.email,
			progress: progressDoc.progress,
			updatedAt: progressDoc.updatedAt,
		});
	} catch (err) {
		console.error("Save progress error:", err);
		return res.status(500).json({ error: "Failed to save progress" });
	}
});

// Example levels endpoint (static)
app.get("/api/levels", (req, res) => {
	res.json({
		categories: ["easy", "medium", "hard", "impossible"],
		levels: {
			easy: [1, 2, 3],
			medium: [1, 2, 3],
			hard: [1, 2, 3],
			impossible: [1],
		},
	});
});

app.listen(PORT, () => {
	console.log(`Typing backend listening on http://localhost:${PORT}`);
	console.log(`Using MongoDB database`);
});

