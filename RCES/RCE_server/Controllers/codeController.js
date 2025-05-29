const runCode = require("./Runner");
const Question = require("../Models/Questions");
const TestCase = require("../Models/TestCases");
const Submission = require("../Models/Submission");

// ✅ Run Code on Test Cases
exports.run = async (req, res) => {
  try {
    const { questionId, language, code } = req.body;

    // Validate input
    if (!questionId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "Question ID, language, and code are required.",
      });
    }

    // Fetch the question
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

    res.status(200).json({
      success: true,
      message: "Code executed on test cases.",
      results,
      allPassed,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while running the code.",
      error: err.message,
    });
  }
};

// ✅ Submit Code
exports.submit = async (req, res) => {
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

    // Fetch the question
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