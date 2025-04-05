const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false, // false = hidden test case
  },
  memoryLimitMB: {
    type: Number,
    default: 128, // per test case memory limit in MB
  },
  timeLimitSec: {
    type: Number,
    default: 2, // per test case time limit in seconds
  },
});

module.exports = mongoose.model("TestCase", testCaseSchema);
