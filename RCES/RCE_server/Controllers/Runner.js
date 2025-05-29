const executeCode = require("../runner/utils/executeCode");

exports.runCode = async (req, res) => {
  const { language, code, testCases } = req.body;

  // Validate input
  if (!language || !code || !testCases || !Array.isArray(testCases)) {
    return res.status(400).json({
      success: false,
      message: "Invalid input. Please provide language, code, and test cases.",
    });
  }

  try {
    // Execute the code using the utility function
    const result = await executeCode(language, code, testCases);

    // Respond with the result
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    // Handle errors gracefully
    res.status(500).json({
      success: false,
      message: "An error occurred while executing the code.",
      error: error.message,
    });
  }
};

