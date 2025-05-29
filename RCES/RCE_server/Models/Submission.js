const mongoose = require("mongoose");

// Define the Submission Schema
const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question ID is required"],
    },
    language: {
      type: String,
      required: [true, "Programming language is required"],
    },
    code: {
      type: String,
      required: [true, "Code is required"],
    },
    output: {
      type: String,
    },
    passedTestCases: {
      type: Number,
      default: 0,
      min: [0, "Passed test cases cannot be negative"],
    },
    totalTestCases: {
      type: Number,
      default: 0,
      min: [0, "Total test cases cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Success", "Failed", "Error"],
      required: [true, "Submission status is required"],
    },
    memoryUsedMB: {
      type: Number,
      default: 0,
      min: [0, "Memory used cannot be negative"],
    },
    timeUsedSec: {
      type: Number,
      default: 0,
      min: [0, "Time used cannot be negative"],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add an index for faster retrieval of submissions by student and question
submissionSchema.index({ student: 1, question: 1 });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);