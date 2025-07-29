// Create a new file: Models/ContestParticipation.js

const mongoose = require("mongoose");

const contestParticipationSchema = new mongoose.Schema({
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["InProgress", "Completed"],
    default: "InProgress",
  },
  finalScore: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Ensure a user can only participate in a contest once
contestParticipationSchema.index({ contest: 1, student: 1 }, { unique: true });

module.exports = mongoose.models.ContestParticipation || mongoose.model("ContestParticipation", contestParticipationSchema);