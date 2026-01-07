import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			index: true,
		},
		progress: {
			type: mongoose.Schema.Types.Mixed,
			default: {
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
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

export const Progress = mongoose.model("Progress", progressSchema);

