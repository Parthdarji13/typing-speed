import express from "express";
import { Progress } from "../models/Progress.js";
import { User } from "../models/User.js";

const router = express.Router();

// Save progress
router.post("/save", async (req, res) => {
  try {
    const { username, difficulty, levelNumber, wpm, accuracy, mistakes } = req.body;

    console.log(`🔄 Saving progress for ${username}: ${difficulty} level ${levelNumber}`);

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find or create progress document
    let progress = await Progress.findOne({ userId: user._id });
    
    if (!progress) {
      progress = new Progress({
        userId: user._id,
        email: user.email,
      });
    }

    // Update the specific level
    const levelKey = `level${levelNumber}`;
    
    if (!progress.progress[difficulty]) {
      progress.progress[difficulty] = {};
    }
    
    if (!progress.progress[difficulty][levelKey]) {
      progress.progress[difficulty][levelKey] = {
        completed: false,
        bestWpm: 0,
        bestAccuracy: 0,
        completedAt: null
      };
    }

    const level = progress.progress[difficulty][levelKey];
    
    // Update level data
    level.completed = true;
    level.completedAt = new Date();
    
    // Update best stats if better
    if (wpm > level.bestWpm) {
      level.bestWpm = wpm;
    }
    if (accuracy > level.bestAccuracy) {
      level.bestAccuracy = accuracy;
    }

    // Calculate total completed
    let totalCompleted = 0;
    Object.values(progress.progress).forEach(diff => {
      if (typeof diff === 'object' && diff !== null) {
        Object.values(diff).forEach(lvl => {
          if (lvl && lvl.completed) totalCompleted++;
        });
      }
    });
    
    progress.progress.totalCompleted = totalCompleted;
    progress.progress.lastPlayed = new Date();
    progress.markModified('progress');

    await progress.save();

    console.log(`✅ Progress saved for ${username}: ${difficulty} level ${levelNumber}`);

    res.json({
      success: true,
      message: "Progress saved successfully",
      totalCompleted: progress.progress.totalCompleted
    });

  } catch (error) {
    console.error("❌ Error saving progress:", error);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

// Load progress
router.get("/load/:username", async (req, res) => {
  try {
    const { username } = req.params;

    console.log(`📥 Loading progress for ${username}`);

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find progress
    const progress = await Progress.findOne({ userId: user._id });

    if (!progress) {
      console.log(`ℹ️ No progress found for ${username}, returning defaults`);
      return res.json({
        success: true,
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
          lastPlayed: null
        }
      });
    }

    console.log(`✅ Progress loaded for ${username}`);

    res.json({
      success: true,
      progress: progress.progress
    });

  } catch (error) {
    console.error("❌ Error loading progress:", error);
    res.status(500).json({ error: "Failed to load progress" });
  }
});

// Reset progress
router.post("/reset", async (req, res) => {
  try {
    const { username } = req.body;

    console.log(`🔄 Resetting progress for ${username}`);

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete progress
    await Progress.findOneAndDelete({ userId: user._id });

    console.log(`✅ Progress reset for ${username}`);

    res.json({
      success: true,
      message: "Progress reset successfully"
    });

  } catch (error) {
    console.error("❌ Error resetting progress:", error);
    res.status(500).json({ error: "Failed to reset progress" });
  }
});

export default router;