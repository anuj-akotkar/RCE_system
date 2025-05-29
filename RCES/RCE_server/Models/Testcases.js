const mongoose = require("mongoose");

// Define the Test Case Schema
const testCaseSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question ID is required"],
    },
    input: {
      type: String,
      required: [true, "Input is required"],
    },
    expectedOutput: {
      type: String,
      required: [true, "Expected output is required"],
    },
    isPublic: {
      type: Boolean,
      default: false, // false = hidden test case
    },
    memoryLimitMB: {
      type: Number,
      default: 128, // per test case memory limit in MB
      min: [16, "Memory limit must be at least 16MB"],
    },
    timeLimitSec: {
      type: Number,
      default: 2, // per test case time limit in seconds
      min: [1, "Time limit must be at least 1 second"],
    },
  },
  { timestamps: true }
);

// Add an index for faster retrieval of test cases by question
testCaseSchema.index({ question: 1 });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.TestCase || mongoose.model("TestCase", testCaseSchema);