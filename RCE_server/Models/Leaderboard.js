const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  timeTaken: {
    type: Number, // seconds
    default: 0,
  },
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
