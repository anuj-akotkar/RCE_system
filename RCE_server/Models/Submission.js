const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  output: {
    type: String,
  },
  passedTestCases: {
    type: Number,
  },
  totalTestCases: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Success", "Failed", "Error"],
  },
  memoryUsedMB: {
    type: Number,
  },
  timeUsedSec: {
    type: Number,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
