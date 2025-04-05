const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  page: {
    type: String, // Optional - where the feedback was submitted from
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
