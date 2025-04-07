const mongoose = require("mongoose");

const contestProgressSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  completedQuestions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model("ContestProgress", contestProgressSchema);
