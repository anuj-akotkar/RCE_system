const ContestFileManager = require("../Services/ContestFileManager");
const BoilerplateGeneratorService = require("../boilerplate-generator/dist/index"); // Use dist version
const TestCase = require("../Models/Testcases");
const Contest = require("../Models/Contest");
const Question = require("../Models/Questions");
const mongoose = require("mongoose");
const fs = require('fs').promises;
const path = require('path');

// Create a new question, generate boilerplate and save files
exports.createQuestion = async (req, res) => {
  try {
    const { 
      contestId, title, description, constraints, sampleInputs, sampleOutputs, 
      functionName, inputFields, inputTypes, outputFields, outputTypes, testCases, difficulty 
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ success: false, message: "Invalid contest ID." });
    }
    if (!title || !description || !functionName || !inputFields || !inputTypes || !outputFields || !outputTypes || !testCases) {
      return res.status(400).json({ success: false, message: "All required fields must be provided." });
    }

    // Create question in database first
    const question = await Question.create({
      contest: contestId,
      title,
      description,
      constraints,
      sampleInputs,
      sampleOutputs,
      functionName,
      inputFields,
      inputTypes,
      outputFields,
      outputTypes,
      difficulty: difficulty || 'medium',
    });

    // Add question to contest
    await Contest.findByIdAndUpdate(contestId, { $push: { questions: question._id } });

    // Get contest details
    const contestDoc = await Contest.findById(contestId);
    if (!contestDoc) throw new Error('Contest not found');

    const contestName = contestDoc.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const problemName = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    // Generate structure.md content
    const structureMd = `Problem Name: "${title}"
Function Name: ${functionName}
Input Structure:
${inputFields.map((field, index) => `Input Field: ${inputTypes[index]} ${field}`).join('\n')}
Output Structure:
${outputFields.map((field, index) => `Output Field: ${outputTypes[index]} ${field}`).join('\n')}`;

    // Format test cases for boilerplate generator
    const formattedTestCases = testCases.map(tc => ({
      input: tc.input.toString(),
      output: tc.expectedOutput.toString()
    }));

    // Generate boilerplate using your service
    const boilerplateService = new BoilerplateGeneratorService();
    const generationResult = await boilerplateService.generateBoilerplateForProblem(
      contestName,
      problemName,
      structureMd,
      formattedTestCases
    );

    // Create test cases in database
    const testCaseIds = [];
    for (const tc of testCases) {
      const testCaseDoc = await TestCase.create({
        question: question._id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isPublic: tc.isPublic || false,
      });
      testCaseIds.push(testCaseDoc._id);
    }
    question.testCases = testCaseIds;
    await question.save();

    res.status(201).json({
      success: true,
      message: "Question created successfully with boilerplate files.",
      question: {
        ...question.toObject(),
        boilerplateGenerated: true,
        folderPath: generationResult.contestPath
      },
    });

  } catch (err) {
    console.error('❌ Error creating question:', err);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the question.",
      error: err.message,
    });
  }
};

// Get boilerplate code for a question
exports.getQuestionBoilerplate = async (req, res) => {
  try {
    const { questionId, language } = req.params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ success: false, message: "Invalid question ID." });
    }

    const question = await Question.findById(questionId).populate('contest');
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const contestName = question.contest.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const problemName = question.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const extension = language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'py';

    // Correct path: Contests/<contestName>/problems/<problemName>/boilerplate/function.<ext>
    const boilerplatePath = path.join(
      process.cwd(),
      'Contests',
      contestName,
      'problems',
      problemName,
      'boilerplate',
      `function.${extension}`
    );

    try {
      const boilerplateCode = await fs.readFile(boilerplatePath, 'utf8');
      res.json({
        success: true,
        question: {
          id: question._id,
          title: question.title,
          description: question.description,
          constraints: question.constraints,
          sampleInputs: question.sampleInputs,
          sampleOutputs: question.sampleOutputs
        },
        boilerplate: {
          language,
          code: boilerplateCode
        }
      });
    } catch (fileError) {
      console.error('Error reading boilerplate file:', fileError);
      res.status(404).json({
        success: false,
        message: "Boilerplate file not found for this language."
      });
    }

  } catch (err) {
    console.error('Error getting question boilerplate:', err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the question boilerplate.",
      error: err.message,
    });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ success: false, message: "Invalid question ID." });
    }

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

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ success: false, message: "Invalid question ID." });
    }

    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

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

// Get all questions (optionally for a contest)
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

// Get a single question by ID
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