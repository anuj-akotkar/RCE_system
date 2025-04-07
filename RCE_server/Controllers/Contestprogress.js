const ContestProgress = require("../Models/Contestprogress");

exports.updateContestProgress = async (req, res) => {
  try {
    const { contestId, questionId } = req.body;
    const userId = req.user.id;

    let progress = await ContestProgress.findOne({ student: userId, contest: contestId });

    if (!progress) {
      progress = await ContestProgress.create({
        student: userId,
        contest: contestId,
        completedQuestions: [questionId],
      });
    } else {
      if (!progress.completedQuestions.includes(questionId)) {
        progress.completedQuestions.push(questionId);
        await progress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const Question = require("../models/Question");

exports.getContestProgressPercentage = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id;

    const progress = await ContestProgress.findOne({
      student: userId,
      contest: contestId,
    });

    if (!progress) {
      return res.status(200).json({ success: true, percentage: 0 });
    }

    const totalQuestions = await Question.countDocuments({ contest: contestId });

    const percentage =
      totalQuestions === 0
        ? 0
        : Math.floor((progress.completedQuestions.length / totalQuestions) * 100);

    res.status(200).json({
      success: true,
      percentage,
      totalQuestions,
      completed: progress.completedQuestions.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
