const mongoose = require("mongoose");

// Define the Language Configuration Schema
const languageConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Programming language name is required"],
      unique: true,
      trim: true,
      enum: ["cpp", "java", "python"], // Restrict to supported languages
    },
    displayName: {
      type: String,
      required: [true, "Display name is required"],
      trim: true,
    },
    extension: {
      type: String,
      required: [true, "File extension is required"],
      unique: true,
      trim: true,
    },
    judge0Id: {
      type: Number,
      required: [true, "Judge0 language ID is required"],
      unique: true,
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
    // Additional fields for better configuration
    monacoLanguage: {
      type: String,
      required: true,
      // For frontend code editor syntax highlighting
    },
    defaultTimeLimit: {
      type: Number,
      default: 2, // seconds
      min: [1, "Time limit must be at least 1 second"],
      max: [10, "Time limit cannot exceed 10 seconds"],
    },
    defaultMemoryLimit: {
      type: Number,
      default: 128, // MB
      min: [32, "Memory limit must be at least 32MB"],
      max: [512, "Memory limit cannot exceed 512MB"],
    },
    maxCodeSize: {
      type: Number,
      default: 50000, // characters
      min: [1000, "Max code size must be at least 1000 characters"],
      max: [100000, "Max code size cannot exceed 100000 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add an index for faster lookups by language name
languageConfigSchema.index({ name: 1 });
languageConfigSchema.index({ judge0Id: 1 });

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.LanguageConfig || mongoose.model("LanguageConfig", languageConfigSchema);