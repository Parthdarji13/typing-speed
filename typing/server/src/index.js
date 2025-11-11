import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { getFirebaseAdmin } from "./firebaseAdmin.js";
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

// In-memory store for demo purposes
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
	res.status(200).json({ status: "ok", service: "typing-backend" });
});

// Registration using Firebase Admin: create user with random password and email credentials
app.post("/auth/register", async (req, res) => {
	try {
		const { name, email } = req.body || {};
		if (!name || !email) {
			return res.status(400).json({ error: "name and email are required" });
		}
		const admin = getFirebaseAdmin();

		// Check if user exists
		let existing = null;
		try {
			existing = await admin.auth().getUserByEmail(email.toLowerCase());
		} catch (e) {
			// not found
		}

		let userRecord;
		const username = existing?.customClaims?.username || generateUsernameFromName(name);
		// Generate a strong random password
		const tempPassword = crypto.randomBytes(12).toString("base64url");

		if (existing) {
		  // Update password if user already exists
		  userRecord = existing;
		  await admin.auth().updateUser(existing.uid, { password: tempPassword, displayName: name });
		  // Ensure username claim persists
		  const claims = existing.customClaims || {};
		  if (!claims.username) {
		    await admin.auth().setCustomUserClaims(existing.uid, { ...claims, username });
		  }
		} else {
			// Create user with generated password
			userRecord = await admin.auth().createUser({
				displayName: name,
				email: email.toLowerCase(),
				emailVerified: false,
				password: tempPassword,
			});
			// Store username in custom claims
			await admin.auth().setCustomUserClaims(userRecord.uid, { username });
		}

		// Email credentials
		const mailer = createMailer();
		const usernameClaim = username || userRecord.displayName || "user";
		await mailer.sendCredentialsEmail({
			to: email.toLowerCase(),
			username: usernameClaim,
			password: tempPassword,
		});

		return res.status(200).json({ message: "Credentials sent to email" });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error("Register error:", err);
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

// Firestore-backed progress by email
app.get("/api/progress-by-email/:email", async (req, res) => {
	try {
		const { email } = req.params;
		if (!email) return res.status(400).json({ error: "email required" });
		const admin = getFirebaseAdmin();
		const user = await admin.auth().getUserByEmail(email.toLowerCase());
		const db = admin.firestore();
		const docRef = db.collection("users").doc(user.uid).collection("app").doc("progress");
		const snap = await docRef.get();
		const data = snap.exists ? snap.data() : { progress: null, updatedAt: null };
		return res.json({ uid: user.uid, email: user.email, progress: data.progress || null, updatedAt: data.updatedAt || null });
	} catch (err) {
		// eslint-disable-next-line no-console
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
		const admin = getFirebaseAdmin();
		const user = await admin.auth().getUserByEmail(email.toLowerCase());
		const db = admin.firestore();
		const docRef = db.collection("users").doc(user.uid).collection("app").doc("progress");
		const enriched = { progress, updatedAt: new Date().toISOString() };
		await docRef.set(enriched, { merge: true });
		return res.status(200).json({ uid: user.uid, email: user.email, ...enriched });
	} catch (err) {
		// eslint-disable-next-line no-console
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
	// eslint-disable-next-line no-console
	console.log(`Typing backend listening on http://localhost:${PORT}`);
});


