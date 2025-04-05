const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },           // e.g., "Python"
  extension: { type: String, required: true },      // e.g., ".py"
  version: { type: String },                        // e.g., "3.10"
  compilerCommand: { type: String },                // Optional
});

module.exports = mongoose.model("Language", languageSchema);
