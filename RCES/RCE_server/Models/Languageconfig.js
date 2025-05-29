const mongoose = require("mongoose");

// Define the Language Configuration Schema
const languageConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Programming language name is required"],
      unique: true,
      trim: true,
    },
    extension: {
      type: String,
      required: [true, "File extension is required"],
      unique: true,
      trim: true,
    },
    version: {
      type: String,
      required: [true, "Language version is required"],
    },
    compilerCommand: {
      type: String,
      required: [true, "Compiler command is required"],
    },
    executionCommand: {
      type: String,
      required: [true, "Execution command is required"],
    },
  },
  { timestamps: true }
);

// Add an index for faster lookups by language name
languageConfigSchema.index({ name: 1 });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.LanguageConfig || mongoose.model("LanguageConfig", languageConfigSchema);