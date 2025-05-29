const mongoose = require("mongoose");

// Define the Profile Schema
const profileSchema = new mongoose.Schema(
  {
    // In Models/Profile.js
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: false, // <-- change to false
    },
    dateOfBirth: {
      type: Date,
      required: false, // <-- change to false
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, "About section cannot exceed 500 characters"],
      required: false,
    },
    contactNumber: {
      type: String,
      trim: true,
      required: false,
      validate: {
        validator: function (value) {
          // Allow empty or null, or must be a 10-digit number
          return !value || /^[0-9]{10}$/.test(value);
        },
        message: "Please provide a valid 10-digit contact number",
      },
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.Profile || mongoose.model("Profile", profileSchema);