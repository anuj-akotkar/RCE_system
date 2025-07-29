const Contest = require("../Models/Contest");
const User = require("../Models/User");
const Question = require("../Models/Questions");
const TestCase = require("../Models/Testcases");
const Submission = require("../Models/Submission"); // 👈 Import Submission model
const ContestParticipation = require("../Models/ContestParticipation"); // 👈 Import ContestParticipation model
const mongoose = require("mongoose");
const ContestFileManager = require("../Services/ContestFileManager");
const BoilerplateGeneratorService = require("../boilerplate-generator/dist/index");

// ... (all your existing functions like createContest, editContest, etc.)

// ✅ Submit Contest and Finalize Score
exports.submitContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const studentId = req.user.id;

    // 1. Find the contest and its questions
    const contest = await Contest.findById(contestId).populate("questions");

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    if (contest.questions.length === 0) {
        return res.status(400).json({
            success: false,
            message: "This contest has no questions to score."
        });
    }

    let finalScore = 0;
    const totalPossibleScore = contest.questions.length * 100; // Assuming each question is worth 100 points

    // 2. Find the user's best submission for each question in the contest
    for (const question of contest.questions) {
      const bestSubmission = await Submission.findOne({
        student: studentId,
        question: question._id,
      }).sort({ passedTestCases: -1 }); // Find submission with the most passed test cases

      if (bestSubmission && bestSubmission.totalTestCases > 0) {
        // Calculate score for this question (out of 100)
        const questionScore = (bestSubmission.passedTestCases / bestSubmission.totalTestCases) * 100;
        finalScore += questionScore;
      }
    }

    // 3. Update the ContestParticipation record
    const participation = await ContestParticipation.findOneAndUpdate(
      { contest: contestId, student: studentId },
      {
        finalScore: finalScore,
        status: "Completed",
        completedAt: new Date(),
      },
      { new: true, upsert: true } // `upsert: true` creates the record if it doesn't exist
    );

    res.status(200).json({
      success: true,
      message: "Contest submitted successfully!",
      data: {
        finalScore: participation.finalScore,
        totalPossibleScore: totalPossibleScore,
        status: participation.status,
      },
    });

  } catch (err) {
    console.error('💥 Contest submission error:', err);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the contest.",
      error: err.message,
    });
  }
};

// ✅ Create Contest
exports.createContest = async (req, res) => {
  try {
    let { title, description, timeLimit, questions = [] } = req.body;
    const instructorId = req.user.id;

    if (!timeLimit) {
      return res.status(400).json({
        success: false,
        message: "Time limit is required.",
      });
    }

    const now = new Date();
    let startTime = now.toISOString();
    let endTime = new Date(now.getTime() + timeLimit * 60000).toISOString();

    if (!title || !description || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and at least one question are required.",
      });
    }

    console.log(`🎯 Creating contest: ${title} with ${questions.length} questions`);

    // Create contest first (without questions)
    const contest = await Contest.create({
      title,
      description,
      startTime,
      endTime,
      timeLimit,
      instructor: instructorId,
      questions: [], // Will be populated later
    });

    console.log(`✅ Contest created in database: ${contest._id}`);

    // Process each question using the Question controller logic
    const questionIds = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      console.log(`📝 Processing question ${i + 1}/${questions.length}: ${q.title}`);
      try {
        // Create question with boilerplate generation
        const questionDoc = await Question.create({
          contest: contest._id,
          title: q.title,
          description: q.description,
          constraints: q.constraints || '',
          sampleInputs: q.sampleInputs || [],
          sampleOutputs: q.sampleOutputs || [],
          functionName: q.functionName,
          inputFields: q.inputFields,
          inputTypes: q.inputTypes,
          outputFields: q.outputFields,
          outputTypes: q.outputTypes,
          difficulty: q.difficulty || 'medium',
        });

        // Generate boilerplate for this question
          const contestName = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
          const problemName = q.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
          const structureMd = `Problem Name: "${q.title}"
          Function Name: ${q.functionName}
          Input Structure:
          ${q.inputFields.map((field, index) => `Input Field: ${q.inputTypes[index]} ${field}`).join('\n')}
        Output Structure:
          ${q.outputFields.map((field, index) => `Output Field: ${q.outputTypes[index]} ${field}`).join('\n')}`;
          const boilerplateService = new BoilerplateGeneratorService();
          const mappedTestCases = (q.testCases || []).map(tc => ({
              input: tc.input,
              output: tc.expectedOutput ?? tc.output ?? ""
          }));
          await boilerplateService.generateBoilerplateForProblem(
            contestName,
            problemName,
            structureMd,
            mappedTestCases
        );

        // Create test cases in database
        const testCaseIds = [];
        for (const tc of q.testCases || []) {
          const testCaseDoc = await TestCase.create({
            question: questionDoc._id,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isPublic: tc.isPublic || false,
          });
          testCaseIds.push(testCaseDoc._id);
        }
        questionDoc.testCases = testCaseIds;
        await questionDoc.save();
        questionIds.push(questionDoc._id);
        console.log(`✅ Question ${i + 1} created with boilerplate`);
      } catch (questionError) {
        console.error(`❌ Error processing question ${q.title}:`, questionError);
        throw new Error(`Failed to process question: ${q.title} - ${questionError.message}`);
      }
    }

    // Update contest with question IDs
    contest.questions = questionIds;
    await contest.save();

    console.log(`🎉 Contest created successfully with ${questionIds.length} questions`);

    res.status(201).json({
      success: true,
      message: "Contest created successfully with boilerplate generation.",
      contest: {
        ...contest.toObject(),
        questionsCreated: questionIds.length,
        boilerplateGenerated: true
      },
    });

  } catch (err) {
    console.error('💥 Contest creation error:', err);
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