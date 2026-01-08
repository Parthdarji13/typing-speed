import authRoutes from "./routes/auth.js";
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

app.use("/auth", authRoutes);


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

app.get("/test-email", async (req, res) => {
  try {
    const { sendCredentialsEmail } = await import("./email.js");

    await sendCredentialsEmail(
      "pnd61430@gmail.com",
      "testuser",
      "test123"
    );

    res.json({ message: "Test email sent successfully" });
  } catch (err) {
    console.error("EMAIL TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});



app.post("/test/result", (req, res) => {
  console.log("📊 Typing Result Received:", req.body);
  res.json({ ok: true });
});


// Start server
async function startServer() {
	await connectMongoDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

}

startServer();
