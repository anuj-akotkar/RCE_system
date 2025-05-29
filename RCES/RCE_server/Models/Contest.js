const mongoose = require("mongoose");

// Define the Contest Schema
const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Contest title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Contest description is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
      validate: {
        validator: function (value) {
          return value > this.startTime;
        },
        message: "End time must be after the start time",
      },
    },
    // totalReward: {
    //   type: Number,
    //   default: 0,
    //   min: [0, "Total reward cannot be negative"],
    // },
    timeLimit: {
      type: Number, // Time limit in minutes
      default: null,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    thumbnail: {
    type: String,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    leaderboard: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leaderboard",
      },
    ],
  },
  { timestamps: true }
);

// Add an index for faster retrieval of contests by instructor
contestSchema.index({ instructor: 1 });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.Contest || mongoose.model("Contest", contestSchema);