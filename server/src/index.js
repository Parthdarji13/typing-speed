import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
async function connectMongoDB() {
	const MONGODB_URI = process.env.MONGODB_URI;

	if (!MONGODB_URI) {
		throw new Error("MONGODB_URI environment variable is required");
	}

	try {
		await mongoose.connect(MONGODB_URI);
		console.log("✅ Connected to MongoDB");
	} catch (error) {
		console.error("❌ MongoDB connection error:", error);
		process.exit(1);
	}
}

// Health check route
app.get("/health", (req, res) => {
	res.json({
		status: "ok",
		database: mongoose.connection.readyState === 1 ? "mongodb" : "disconnected",
	});
});

// Start server
async function startServer() {
	await connectMongoDB();

	app.listen(PORT, () => {
		console.log(`🚀 Server running on port ${PORT}`);
	});
}

startServer();
