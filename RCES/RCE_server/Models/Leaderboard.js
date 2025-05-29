const mongoose = require("mongoose");

// Define the Leaderboard Schema
const leaderboardSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: [true, "Contest ID is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    score: {
      type: Number,
      default: 0,
      min: [0, "Score cannot be negative"],
    },
    timeTaken: {
      type: Number, // Time taken in seconds
      default: 0,
      min: [0, "Time taken cannot be negative"],
    },
  },
  { timestamps: true }
);

// Add a compound index for faster retrieval of leaderboard entries by contest and user
leaderboardSchema.index({ contest: 1, user: 1 }, { unique: true });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema);