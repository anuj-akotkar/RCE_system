const mongoose = require("mongoose");

// Define the Contest Progress Schema
const contestProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: [true, "Contest ID is required"],
    },
    completedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
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

// Add a compound index for faster retrieval of progress by student and contest
contestProgressSchema.index({ student: 1, contest: 1 }, { unique: true });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.ContestProgress || mongoose.model("ContestProgress", contestProgressSchema);