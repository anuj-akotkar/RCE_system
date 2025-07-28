// Updated Contest.js Model - Add practice mode support
const mongoose = require("mongoose");

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
    // New fields for practice mode
    allowPracticeMode: {
      type: Boolean,
      default: true, // Allow practice after contest ends
    },
    practiceStartTime: {
      type: Date,
      default: function() {
        return this.endTime; // Practice starts when contest ends
      }
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "ended", "practice"],
      default: "upcoming"
    }
  },
  { timestamps: true }
);

// Add method to get contest status
contestSchema.methods.getContestStatus = function() {
  const now = new Date();
  
  if (now < this.startTime) {
    return "upcoming";
  } else if (now >= this.startTime && now <= this.endTime) {
    return "ongoing";
  } else if (this.allowPracticeMode) {
    return "practice";
  } else {
    return "ended";
  }
};

// Add index for faster retrieval
contestSchema.index({ instructor: 1 });
contestSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.models.Contest || mongoose.model("Contest", contestSchema);

// Updated ContestProgress.js Model - Add practice mode tracking
const contestProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: [true, "Contest ID is required"],
    },
    completedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    score: {
      type: Number,
      default: 0,
      min: [0, "Score cannot be negative"],
    },
    timeTaken: {
      type: Number, // Time taken in seconds
      default: 0,
      min: [0, "Time taken cannot be negative"],
    },
    // New fields for practice mode
    participationMode: {
      type: String,
      enum: ["contest", "practice"], // Track if user participated during contest or practice
      required: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date
    },
    finalScore: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    eligibleForLeaderboard: {
      type: Boolean,
      default: true // False for practice mode participants
    }
  },
  { timestamps: true }
);

// Add compound index for faster retrieval
contestProgressSchema.index({ student: 1, contest: 1 }, { unique: true });
contestProgressSchema.index({ contest: 1, eligibleForLeaderboard: 1, finalScore: -1 }); // For leaderboard queries

module.exports = mongoose.models.ContestProgress || mongoose.model("ContestProgress", contestProgressSchema);
