const Question = require("../Models/Questions");
const Contest = require("../Models/Contest");
const mongoose = require("mongoose");

// ✅ Create Question & Add to Contest
exports.createQuestion = async (req, res) => {
  try {
    const { contestId, title, description, inputFormat, outputFormat, constraints, sampleTestCases, difficulty } = req.body;

    // Validate contestId
    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ success: false, message: "Invalid contest ID." });
    }

    // Validate required fields
    if (!title || !description || !inputFormat || !outputFormat || !constraints || !sampleTestCases || !difficulty) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Create a new question
    const question = await Question.create({
      contest: contestId,
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleTestCases,
      difficulty,
    });

    // Add the question to the contest
    await Contest.findByIdAndUpdate(contestId, { $push: { questions: question._id } });

    res.status(201).json({
      success: true,
      message: "Question created successfully and added to the contest.",
      question,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the question.",
      error: err.message,
    });
  }
};

// ✅ Update Question
exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const updates = req.body;

    // Validate questionId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ success: false, message: "Invalid question ID." });
    }

    // Update the question
    const updatedQuestion = await Question.findByIdAndUpdate(questionId, updates, { new: true });

    if (!updatedQuestion) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      question: updatedQuestion,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the question.",
      error: err.message,
    });
  }
};

// ✅ Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Validate questionId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ success: false, message: "Invalid question ID." });
    }

    // Find and delete the question
    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    // Remove the question from the contest
    await Contest.findByIdAndUpdate(deletedQuestion.contest, { $pull: { questions: questionId } });

    res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the question.",
      error: err.message,
    });
  }
};

// ✅ Get all questions (optionally for a contest)
exports.getAllQuestions = async (req, res) => {
  try {
    const { contestId } = req.query;
    let questions;
    if (contestId) {
      questions = await Question.find({ contest: contestId });
    } else {
      questions = await Question.find();
    }
    res.status(200).json({
      success: true,
      questions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching questions.",
      error: err.message,
    });
  }
};

// ✅ Get a single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ success: false, message: "Invalid question ID." });
    }
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }
    res.status(200).json({
      success: true,
      question,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the question.",
      error: err.message,
    });
  }
};