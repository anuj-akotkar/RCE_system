const mongoose = require("mongoose");

// Define the Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    type: {
      type: String,
      enum: ["Contest", "Submission", "System", "Message"],
      required: [true, "Notification type is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add an index for faster retrieval of notifications by user and seen status
notificationSchema.index({ user: 1, seen: 1 });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);