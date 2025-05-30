const mongoose = require("mongoose");

// Define the Question Schema
const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    constraints: {
      type: String,
      trim: true,
    },
    starterCode: {
      type: String,
      trim: true,
    },
    expectedOutput: {
      type: String,
      trim: true,
    },
    memoryLimitMB: {
      type: Number,
      default: 128,
      min: [16, "Memory limit must be at least 16MB"],
    },
    timeLimitSec: {
      type: Number,
      default: 2,
      min: [1, "Time limit must be at least 1 second"],
    },
    testCases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestCase",
      },
    ],
     sampleInputs: {
      type: [String],
      default: [],
    },
    sampleOutputs: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Add an index for faster retrieval of questions by difficulty
questionSchema.index({ difficulty: 1 });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.Question || mongoose.model("Question", questionSchema);