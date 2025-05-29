const ContestProgress = require("../Models/Contestprogress");
const Question = require("../Models/Questions");
const mongoose = require("mongoose");

// Update Contest Progress
exports.updateContestProgress = async (req, res) => {
  try {
    const { contestId, questionId } = req.body;
    const userId = req.user.id;

    // Validate contestId and questionId
    if (!mongoose.Types.ObjectId.isValid(contestId) || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest or question ID.",
      });
    }

    // Update progress
    const progress = await ContestProgress.findOneAndUpdate(
      { student: userId, contest: contestId },
      { $addToSet: { completedQuestions: questionId } },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Contest progress updated successfully.",
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating contest progress.",
      error: error.message,
    });
  }
};

// Get Contest Progress Percentage
exports.getContestProgressPercentage = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;

    // Validate contestId
    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest ID.",
      });
    }

    // Fetch contest progress
    const progress = await ContestProgress.findOne({
      student: userId,
      contest: contestId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress found for this contest.",
      });
    }

    // Fetch total questions in the contest
    const totalQuestions = await Question.countDocuments({ contest: contestId });

    // Calculate progress percentage
    const completedQuestions = progress.completedQuestions.length;
    const percentage = ((completedQuestions / totalQuestions) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      message: "Contest progress percentage retrieved successfully.",
      percentage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving contest progress percentage.",
      error: error.message,
    });
  }
};