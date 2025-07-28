const mongoose = require("mongoose");

// Define the Submission Schema
const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Question ID is required"],
    },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
    },
    language: {
      type: String,
      required: [true, "Programming language is required"],
      enum: ["cpp", "java", "python"],
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      maxlength: [100000, "Code cannot exceed 100000 characters"],
    },
    // Detailed results for each test case
    results: [
      {
        testCase: {
          type: Number,
          required: true,
        },
        input: {
          type: String,
          maxlength: [5000, "Input too large"],
        },
        expectedOutput: {
          type: String,
          maxlength: [5000, "Expected output too large"],
        },
        actualOutput: {
          type: String,
          maxlength: [5000, "Actual output too large"],
        },
        passed: {
          type: Boolean,
          required: true,
        },
        executionTime: {
          type: Number, // in seconds
          default: 0,
        },
        memory: {
          type: Number, // in KB
          default: 0,
        },
        status: {
          type: String,
          required: true,
        },
        error: {
          type: String,
          maxlength: [1000, "Error message too long"],
        },
      },
    ],
    // Overall submission statistics
    passed: {
      type: Boolean,
      required: true,
      default: false,
    },
    executionTime: {
      type: String, // Total execution time as string
      required: true,
    },
    memory: {
      type: Number, // Max memory used
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Running", "Accepted", "Wrong Answer", "Time Limit Exceeded", 
             "Memory Limit Exceeded", "Runtime Error", "Compilation Error", "Internal Error"],
      default: "Pending",
    },
    score: {
      type: Number,
      default: 0,
      min: [0, "Score cannot be negative"],
      max: [100, "Score cannot exceed 100"],
    },
    // For tracking submission source
    submissionType: {
      type: String,
      enum: ["practice", "contest"],
      default: "practice",
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
submissionSchema.index({ user: 1, question: 1, createdAt: -1 });
submissionSchema.index({ question: 1, passed: 1 });
submissionSchema.index({ contest: 1, user: 1 });
submissionSchema.index({ createdAt: -1 });

// Virtual for passed test count
submissionSchema.virtual('passedTests').get(function() {
  return this.results.filter(r => r.passed).length;
});

// Virtual for total test count
submissionSchema.virtual('totalTests').get(function() {
  return this.results.length;
});

// Method to calculate score based on test results
submissionSchema.methods.calculateScore = function() {
  if (this.results.length === 0) return 0;
  const passedCount = this.results.filter(r => r.passed).length;
  return Math.round((passedCount / this.results.length) * 100);
};

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);