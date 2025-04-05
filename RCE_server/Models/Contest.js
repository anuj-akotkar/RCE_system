const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  contestName: { type: String },
  contestDescription: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  whatYouWillLearn: {
    type: String,
  },
  contestContent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],
  thumbnail: {
    type: String,
  },
  studentsEnroled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  ],
  instructions: {
    type: [String],
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contest", contestSchema);
