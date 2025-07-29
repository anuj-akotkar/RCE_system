const mongoose = require("mongoose");

// Define the Question Schema
const questionSchema = new mongoose.Schema(
  {
    // 👇 ADD THIS FIELD
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: true,
    },
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
    functionName: { type: String, trim: true },
    inputFields: { type: [String], default: [] },
    inputTypes: { type: [String], default: [] },
    outputFields: { type: [String], default: [] },
    outputTypes: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Add an index for faster lookups by title within a contest
questionSchema.index({ contest: 1, title: 1 });

module.exports = mongoose.models.Question || mongoose.model("Question", questionSchema);
