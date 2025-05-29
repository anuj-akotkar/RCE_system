const Contest = require("../Models/Contest");
const User = require("../Models/User");
const Question = require("../Models/Questions");
const TestCase = require("../Models/Testcases");
const mongoose = require("mongoose");

// ✅ Create Contest
exports.createContest = async (req, res) => {
  try {
    let {
      title,
      description,
      timeLimit,
      questions = [],
    } = req.body;
    const instructorId = req.user.id;

    // If startTime/endTime not provided, calculate from duration
    
      if (!timeLimit) {
        return res.status(400).json({
          success: false,
          message: "Either startTime/endTime or duration is required.",
        });
      }
      const now = new Date();
      let startTime = now.toISOString();
      let endTime = new Date(now.getTime() + timeLimit * 60000).toISOString();
    

    if (!title || !description || !startTime || !endTime || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, description, start time, end time, and at least one question are required.",
      });
    }

    // 1. Create all questions and their test cases
    const questionIds = [];
    for (const q of questions) {
      const questionDoc = await Question.create({
        title: q.title,
        description: q.description,
        sampleInputs: q.sampleInputs,
        sampleOutputs: q.sampleOutputs,
      });

      // Create TestCases for this question
      const testCaseIds = [];
      for (const tc of q.testCases) {
        const testCaseDoc = await TestCase.create({
          question: questionDoc._id,
          input: tc.input,
          expectedOutput: tc.output,
          isPublic: false,
        });
        testCaseIds.push(testCaseDoc._id);
      }

      questionDoc.testCases = testCaseIds;
      await questionDoc.save();
      questionIds.push(questionDoc._id);
    }

    // 2. Create Contest with questionIds
    const contest = await Contest.create({
      title,
      description,
      startTime,
      endTime,
      timeLimit, // Store time limit in minutes
      instructor: instructorId,
      questions: questionIds,
    });

    res.status(201).json({
      success: true,
      message: "Contest created successfully.",
      contest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the contest.",
      error: err.message,
    });
  }
};

// ✅ Edit Contest
exports.editContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest ID.",
      });
    }

    const updatedContest = await Contest.findByIdAndUpdate(contestId, updates, { new: true });

    if (!updatedContest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contest updated successfully.",
      contest: updatedContest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the contest.",
      error: err.message,
    });
  }
};

// ✅ Get Instructor's Contests
exports.getInstructorContests = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const contests = await Contest.find({ instructor: instructorId });
    res.status(200).json({
      success: true,
      contests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving instructor's contests.",
      error: err.message,
    });
  }
};

// ✅ Get All Contests
exports.getAllContests = async (req, res) => {
  try {
    const contests = await Contest.find().populate("instructor", "name email");
    res.status(200).json({
      success: true,
      message: "All contests retrieved successfully.",
      contests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving contests.",
      error: err.message,
    });
  }
};

// ✅ Get Contest Details
exports.getContestDetails = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest ID.",
      });
    }

    const contest = await Contest.findById(contestId).populate("instructor", "name email");

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contest details retrieved successfully.",
      contest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving contest details.",
      error: err.message,
    });
  }
};

// ✅ Get Full Contest Details (including questions)
exports.getFullContestDetails = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest ID.",
      });
    }

    const contest = await Contest.findById(contestId)
      .populate("instructor", "name email")
      .populate("questions");

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Full contest details retrieved successfully.",
      contest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving full contest details.",
      error: err.message,
    });
  }
};

// ✅ Delete Contest
exports.deleteContest = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest ID.",
      });
    }

    const deletedContest = await Contest.findByIdAndDelete(contestId);

    if (!deletedContest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contest deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the contest.",
      error: err.message,
    });
  }
};

// ✅ Get All Students Enrolled in a Contest
exports.getAllStudentEnrolled = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest ID.",
      });
    }

    // Assuming Contest model has an 'enrolledStudents' array of user IDs
    const contest = await Contest.findById(contestId).populate("enrolledStudents", "name email");

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    res.status(200).json({
      success: true,
      students: contest.enrolledStudents || [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching enrolled students.",
      error: err.message,
    });
  }
};