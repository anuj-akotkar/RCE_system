const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionName: { type: String },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

module.exports = mongoose.model("Section", sectionSchema);
