const Question = require("../Models/Questions");
const Submission = require("../Models/Submission");
const TestCase = require("../Models/Testcases");
const runCode = require("./Runner");

// 🧪 RUN CODE ON PUBLIC TEST CASES
exports.runCodeOnSample = async (req, res) => {
  try {
    const { questionId, language, code } = req.body;

    // Validate input
    if (!questionId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "Question ID, language, and code are required.",
      });
    }

    // Fetch the question and populate public test cases
    const question = await Question.findById(questionId).populate({
      path: "testCases",
      match: { isPublic: true }
    });
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Run code on public (sample) test cases
    const results = [];
    for (const testCase of question.testCases) {
      const { input, expectedOutput } = testCase;
      const output = await runCode(language, code, input);

      results.push({
        input,
        expectedOutput,
        output,
        passed: output.trim() === expectedOutput.trim(),
      });
    }

    res.status(200).json({
      success: true,
      message: "Code executed on public test cases.",
      results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while running the code.",
      error: err.message,
    });
  }
};

// 🧪 SUBMIT CODE ON ALL TEST CASES (public + hidden)
exports.submitCode = async (req, res) => {
  try {
    const { questionId, language, code } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!questionId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "Question ID, language, and code are required.",
      });
    }

    // Fetch the question and populate all test cases
    const question = await Question.findById(questionId).populate("testCases");
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Run code on all test cases
    const results = [];
    let allPassed = true;

    for (const testCase of question.testCases) {
      const { input, expectedOutput } = testCase;
      const output = await runCode(language, code, input);

      const passed = output.trim() === expectedOutput.trim();
      results.push({
        input,
        expectedOutput,
        output,
        passed,
      });

      if (!passed) {
        allPassed = false;
      }
    }

    // Save submission
    const submission = await Submission.create({
      user: userId,
      question: questionId,
      code,
      language,
      results,
      passed: allPassed,
    });

    res.status(200).json({
      success: true,
      message: "Code submitted successfully.",
      submission,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the code.",
      error: err.message,
    });
  }
};

// Get all submissions for a question
exports.getSubmissionsByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const submissions = await Submission.find({ question: questionId });
    res.status(200).json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a single submission by ID
exports.getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }
    res.status(200).json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};