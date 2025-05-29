const mongoose = require("mongoose");

// Define the Feedback Schema
const feedbackSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: [true, "Contest ID is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Feedback message cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

// Add an index for faster retrieval of feedback by contest
feedbackSchema.index({ contest: 1 });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);