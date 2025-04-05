const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
  constraints: { type: String },
  starterCode: { type: String },
  expectedOutput: { type: String },
  memoryLimitMB: { type: Number, default: 128 },
  timeLimitSec: { type: Number, default: 2 },
  testCases: [
    {
      input: { type: String },
      output: { type: String },
      isPublic: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Question", questionSchema);
